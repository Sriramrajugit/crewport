# HRA (House Rent Allowance) Implementation Summary

## Overview
HRA is implemented as a separate module within the Travel Wages & HRA Management system. It includes dedicated database tables, API endpoints, and a unified frontend component.

---

## 1. API ENDPOINTS

### POST /api/hra
**Location:** [app/api/hra/route.ts](app/api/hra/route.ts)

**Purpose:** Create/update HRA entries for crew members

**Request Format:**
```json
{
  "month": "2025-03-01",              // YYYY-MM-DD format (used to extract month/year)
  "hra_data": [
    {
      "crew_id": 123,
      "days": 30,
      "calculated_amount": 1000.50,
      "hra_period_start": "2025-03-01",
      "hra_period_end": "2025-03-31",
      "days_calculated": 30
    }
  ],
  "hra_end_date": "2025-03-31"        // Optional: explicit end date
}
```

**Response:**
```json
{
  "success": true,
  "message": "HRA entries saved successfully"
}
```

**Process Flow:**
1. Extracts month and year from the date string
2. **Deletes existing HRA entries** for the crew member in that month/year (DUPLICATE PREVENTION)
3. Creates a new `CrewHRAEntry` record with:
   - `hra_date`: Start date of HRA period
   - `hra_period_start`: Start of calculation period
   - `hra_period_end`: End of calculation period
   - `days_calculated`: Number of days for which HRA is calculated
   - `hra_amount`: Total HRA amount
4. Updates `CrewMember.hra` with the new amount
5. Updates or creates `CrewEarnings` record for the month

**Duplicate Prevention:**
```typescript
// Delete existing entries for this crew member in the given month/year
await prisma.crewHRAEntry.deleteMany({
    where: {
        crew_member_id: crewId,
        month: monthValue,
        year: yearValue
    }
});
```
This ensures only one set of HRA entries per crew member per month/year.

---

### GET /api/hra
**Location:** [app/api/hra/route.ts](app/api/hra/route.ts)

**Purpose:** Retrieve HRA entries for a specific month/year and vessel

**Query Parameters:**
- `vesselId` (required): The vessel ID
- `month` (required): Month (1-12)
- `year` (required): Year (YYYY)

**Response:**
```json
[
  {
    "id": 1,
    "crew_member_id": 123,
    "month": 3,
    "year": 2025,
    "hra_date": "2025-03-01",
    "hra_period_start": "2025-03-01",
    "hra_period_end": "2025-03-31",
    "days_calculated": 30,
    "hra_amount": "1000.50",
    "crew_members": {
      "id": 123,
      "name": "John Smith",
      "passport_number": "PS123456"
    }
  }
]
```

**Query Logic:**
- Fetches from `CrewHRAEntry` table
- Filters by month, year, and vessel (via crew member's vessel_id)
- Includes crew member details (name, passport)
- Orders by crew_member_id ascending

---

## 2. DATABASE SCHEMA

### CrewHRAEntry Model
**Location:** [prisma/schema.prisma](prisma/schema.prisma) (Line ~280-310)

```prisma
model CrewHRAEntry {
  id                Int       @id @default(autoincrement())
  crew_member_id    Int
  month             Int       @db.Integer
  year              Int       @db.Integer
  hra_date          DateTime  @db.Date            // Initial HRA date
  hra_period_start  DateTime? @db.Date            // Start of calculation period
  hra_period_end    DateTime? @db.Date            // End of calculation period
  days_calculated   Int?      @default(0)         // Days for which HRA calculated
  hra_amount        Decimal   @db.Decimal(15, 2)  // Total HRA amount
  created_at        DateTime? @default(now()) @db.Timestamp(6)
  updated_at        DateTime? @default(now()) @db.Timestamp(6)
  crew_members      CrewMember @relation(fields: [crew_member_id], references: [id], onDelete: Cascade)

  @@index([crew_member_id], map: "idx_crew_hra_crew_id")
  @@index([crew_member_id, month, year], map: "idx_crew_hra_month_year")
  @@index([month, year], map: "idx_crew_hra_month_year_all")
  @@map("crew_hra_entries")
}
```

**Key Fields:**
- `hra_period_start` & `hra_period_end`: Define the date range for HRA calculation
- `days_calculated`: Number of days used in HRA calculation
- `hra_amount`: Final calculated HRA value
- Composite index on `[crew_member_id, month, year]` for duplicate prevention queries

### CrewMember Extension
The `CrewMember` model includes:
```prisma
model CrewMember {
  // ... other fields ...
  hra                        Decimal?  @db.Decimal(15, 2)
  crew_hra_entries           CrewHRAEntry[]
  crew_travel_wages_entries  CrewTravelWagesEntry[]
}
```

### CrewEarnings Model
Stores monthly HRA values:
```prisma
model CrewEarnings {
  // ... other fields ...
  hra                        Decimal?  @db.Decimal(15, 2)
  // ... other deduction fields ...
  @@unique([crew_member_id, month, year])
}
```

---

## 3. FRONTEND COMPONENT

### Travel Wages & HRA Screen
**Location:** [app/dashboard/travel-wages-hra/page.tsx](app/dashboard/travel-wages-hra/page.tsx)

**Purpose:** Unified interface for managing both Travel Wages and HRA

#### Features:
1. **Tab-based Navigation:**
   - Travel Wages tab (for newly onboarded crew in specific month)
   - HRA tab (for all active crew with date range selection)

2. **Date Selection:**
   - Travel Wages: Single month picker (YYYY-MM-DD)
   - HRA: Date range picker (Start and End dates)

#### HRA Tab Workflow:

**Date Range Input:**
```tsx
<input
  type="date"
  value={hraStartDate}
  onChange={(e) => setHraStartDate(e.target.value)}
/>
<input
  type="date"
  value={hraEndDate}
  onChange={(e) => setHraEndDate(e.target.value)}
/>
```

**Crew Filtering:**
```typescript
const activeCrew = allCrew.filter((member: CrewMember) => {
    const signOnDate = member.sign_on_date ? new Date(member.sign_on_date) : null;
    const signOffDate = member.sign_off_date ? new Date(member.sign_off_date) : null;
    const today = new Date();
    
    // Include crew that have signed on and either no sign-off or sign-off is in future
    const isOnboarded = signOnDate && signOnDate <= today;
    const isNotOffboarded = !signOffDate || signOffDate > today;
    
    return isOnboarded && isNotOffboarded;
});
```

**Eligible Days Calculation:**
```typescript
const eligibleDays = calculateDaysBetween(hraStartDate, hraEndDate);

// Adjust for crew joining/relief during the period
if (signOnDate && signOnDate > hraStartDateObj && signOnDate <= hraEndDateObj) {
    const daysBeforeJoin = calculateDaysBetween(hraStartDate, signOnDate);
    eligibleDays = Math.max(0, totalDays - daysBeforeJoin);
}

if (signOffDate && signOffDate >= hraStartDateObj && signOffDate < hraEndDateObj) {
    const daysAfterRelief = calculateDaysBetween(signOffDate, hraEndDate);
    eligibleDays = Math.max(0, eligibleDays - daysAfterRelief);
}
```

**HRA Calculation:**
```typescript
const calculatePay = (basicSalary: number | null, days: number): number => {
    if (!basicSalary || days === 0) return 0;
    return (basicSalary / 30) * days;  // Formula: (Basic Salary / 30) × Days
};
```

**Data Structure:**
```typescript
interface HRAData {
    crew_id: number;
    days: number;
    calculated_amount: number;
}

const [hraData, setHraData] = useState<Record<number, HRAData>>({});
```

#### HRA Entry Form:
- Displays all active crew members in a table
- Shows: Crew Name, Passport No, Rank, Status, Days, HRA Amount
- Calculated HRA updates automatically when days change
- Clear All button to reset entries

---

## 4. VALIDATION LOGIC

### Duplicate Prevention
**Location:** [app/dashboard/travel-wages-hra/page.tsx](app/dashboard/travel-wages-hra/page.tsx) (Line ~430-460)

```typescript
// Check for duplicate HRA entries for the same date range
for (const entry of payload) {
    const duplicate = savedHRARecords.find(saved => {
        const savedStart = new Date(saved.hra_period_start);
        const savedEnd = new Date(saved.hra_period_end);
        
        // Check if crew already has HRA for this date range
        return saved.crew_member_id === entry.crew_id &&
               savedStart.getTime() === hraStartDateObj.getTime() &&
               savedEnd.getTime() === hraEndDateObj.getTime();
    });

    if (duplicate) {
        alert(`HRA already added for Specific dates`);
        return;
    }
}
```

**Validation Rules:**
1. ✅ At least one crew member must have HRA > 0
2. ✅ Cannot add duplicate HRA for same crew + same date range
3. ✅ Date range must be valid (start ≤ end)
4. ✅ Crew must be active (signed on before end date, not signed off before start date)

---

## 5. DATE HANDLING

### Date Formats:
- **Input Format:** YYYY-MM-DD (HTML date input)
- **Storage Format:** ISO Date (DateTime in database)
- **Display Format:** Localized (toLocaleDateString)

### Key Date Functions:
```typescript
const calculateDaysBetween = (from: string, to: string): number => {
    if (!from || !to) return 0;
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const timeDiff = toDate.getTime() - fromDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both dates
    return Math.max(0, daysDiff);
};
```

### Month/Year Extraction:
```typescript
const dateObj = new Date(month);  // month is "2025-03-15"
const monthValue = dateObj.getMonth() + 1;  // 3 (1-12)
const yearValue = dateObj.getFullYear();    // 2025
```

---

## 6. COMPARISON: TRAVEL WAGES vs HRA

| Aspect | Travel Wages | HRA |
|--------|--------------|-----|
| **Applicable To** | Newly onboarded crew in specific month | All active crew |
| **Date Selection** | Single month picker | Date range picker |
| **Crew Filter** | Signed on IN selected month, not yet offboarded | Currently active (signed on, not offboarded) |
| **Entry Type** | `CrewTravelWagesEntry` | `CrewHRAEntry` |
| **Duplicate Check** | By month/year | By date range |
| **Days Calculation** | Manual input (0-4 days preset) | Automatic from date range with crew eligibility adjustment |
| **Formula** | (Basic Salary / 30) × Days | (Basic Salary / 30) × Days |
| **Historical Tracking** | `travel_wages_date` per entry | `hra_period_start` & `hra_period_end` |

---

## 7. RECENT HRA ENTRIES DISPLAY

The frontend fetches and displays saved HRA records:

```typescript
const formattedRecords = records.map((record: any) => ({
    id: record.id,
    crew_member_id: record.crew_member_id,
    crew_name: record.crew_members?.name || `Crew ${record.crew_member_id}`,
    hra_amount: record.hra_amount,
    days_calculated: record.days_calculated || 0,
    hra_period_start: record.hra_period_start || record.hra_date,
    hra_period_end: record.hra_period_end || record.hra_date
}));
```

Displayed in a table showing:
- Crew Member Name
- HRA Amount
- Days Calculated
- Period Start Date
- Period End Date

---

## 8. KEY IMPLEMENTATION NOTES

### Data Flow:
1. User selects HRA date range and crew members
2. Frontend calculates eligible days per crew (accounting for join/relief dates)
3. Frontend calculates HRA = (Basic Salary / 30) × Days
4. Save button sends to `/api/hra` POST endpoint
5. Backend deletes any existing HRA for that crew+month/year
6. Backend creates new `CrewHRAEntry` record
7. Backend updates `CrewMember.hra` and `CrewEarnings.hra`
8. Frontend shows "HRA saved successfully" message
9. Saved records are refreshed and displayed

### Edge Cases Handled:
- ✅ Crew joining during HRA period: Days reduced by days before joining
- ✅ Crew relief during HRA period: Days reduced by days after relief
- ✅ Crew not yet joined: Excluded from HRA calculation
- ✅ Crew already relieved: Excluded from HRA calculation
- ✅ Invalid date range: Days calculation returns 0

### API Security:
- ✅ Requires `X-Vessel-Id` header
- ✅ Validates vessel access before processing
- ✅ Filters crew by vessel when fetching HRA entries

---

## 9. RELATED FILES

### API Routes:
- [app/api/hra/route.ts](app/api/hra/route.ts) - HRA endpoints
- [app/api/travel-wages/route.ts](app/api/travel-wages/route.ts) - Travel wages endpoints
- [app/api/crew/route.ts](app/api/crew/route.ts) - Crew management with HRA field
- [app/api/crew/earnings/route.ts](app/api/crew/earnings/route.ts) - Earnings tracking

### Frontend Components:
- [app/dashboard/travel-wages-hra/page.tsx](app/dashboard/travel-wages-hra/page.tsx) - Main HRA screen
- [app/dashboard/crew/page.tsx](app/dashboard/crew/page.tsx) - Displays HRA in crew salary form (read-only)
- [app/dashboard/reports/portage-bill/page.tsx](app/dashboard/reports/portage-bill/page.tsx) - Shows HRA in reports

### Database:
- [prisma/schema.prisma](prisma/schema.prisma) - CrewHRAEntry, CrewEarnings models

---

## 10. KNOWN LIMITATIONS

1. **Date Precision:** Uses only date (no time), so all HRA periods end at 00:00
2. **Days Calculation:** Uses calendar days (inclusive), not business days
3. **Single Entry Per Month:** Only one HRA entry allowed per crew per month/year (enforced by deletion)
4. **Manual Date Entry:** No UI validation for date ranges during input (only client-side)
5. **No Edit After Save:** Must delete and recreate entries (via re-save with same dates)

---

## 11. FUTURE ENHANCEMENT OPPORTUNITIES

- [ ] Add edit/delete UI for individual HRA entries instead of full month replacement
- [ ] Implement date range validation in frontend (prevent invalid ranges)
- [ ] Add audit trail for HRA changes
- [ ] Bulk upload support via CSV/Excel
- [ ] HRA rate master table (configurable rates per rank/designation)
- [ ] Period-based HRA (not just calendar months)
- [ ] Approval workflow for HRA entries
