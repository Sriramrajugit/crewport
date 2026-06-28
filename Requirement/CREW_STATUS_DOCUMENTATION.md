# Crew Member Status System Documentation

## Overview
The crew member management system uses **two independent status fields** to track different aspects of a crew member's journey:
1. **onboarding_status** - Administrative approval workflow
2. **crew_status** - Employment lifecycle tracking

---

## 1. onboarding_status Field
**Table**: `crew_members`  
**Type**: VARCHAR(50)  
**Default**: 'PENDING'

### Purpose
Tracks whether a crew member has received administrative approval to join the company/vessel.

### Values

| Value | Meaning | Can Edit Exit Details? | Can Approve? |
|-------|---------|----------------------|-------------|
| **PENDING** | Crew awaiting admin approval | No | Yes |
| **APPROVED** | Admin approved crew member | Yes | No |

### Sample SQL
```sql
SELECT id, name, onboarding_status FROM crew_members;
-- Returns: PENDING or APPROVED
```

### Business Logic
- **New crew entry** → `onboarding_status = 'PENDING'` (auto-set)
- **Admin clicks "Approve"** → `onboarding_status = 'APPROVED'`
- **Stays "APPROVED"** even after exit (historical record)

---

## 2. crew_status Field
**Table**: `crew_members`  
**Type**: VARCHAR(50)  
**Default**: 'NEW'  
**Database Migration**: `20260307103504_add_crew_status`

### Purpose
Tracks the employment lifecycle/journey of the crew member from hiring to exit.

### Values

| Value | Meaning | Onboarding Status | Can Edit Exit? | Timeline |
|-------|---------|-------------------|----------------|----------|
| **NEW** | Crew member created, waiting approval | PENDING | No | Initial state |
| **ACTIVE** | Crew approved & working onboard | APPROVED | Yes | After approval |
| **COMPLETED** | Crew has exited vessel | APPROVED | **No (Locked)** | After exit saved |
| **IN_ACTIVE** | Exit month PB generated (future use) | APPROVED | No | After PB generation |

### Sample SQL
```sql
-- Find all NEW crew awaiting approval
SELECT id, name FROM crew_members WHERE crew_status = 'NEW';

-- Find all active crew onboard
SELECT id, name FROM crew_members 
WHERE crew_status = 'ACTIVE' AND onboarding_status = 'APPROVED';

-- Find all completed/exited crew
SELECT id, name, exit_type FROM crew_members 
WHERE crew_status = 'COMPLETED';
```

---

## 3. Complete State Transitions

### From Create to Exit Flow

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: CREATE NEW CREW MEMBER                              │
├─────────────────────────────────────────────────────────────┤
│ onboarding_status: PENDING                                  │
│ crew_status:       NEW                                      │
│ sign_off_date:     null                                     │
│ exit_type:         null                                     │
│ Action: "Approve" button ENABLED                            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: ADMIN CLICKS APPROVE                                │
├─────────────────────────────────────────────────────────────┤
│ onboarding_status: PENDING → APPROVED ✓                     │
│ crew_status:       NEW → ACTIVE ✓                           │
│ sign_off_date:     null                                     │
│ exit_type:         null                                     │
│ Action: "Edit Exit Details" button ENABLED                  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: ADMIN SAVES EXIT DETAILS                            │
├─────────────────────────────────────────────────────────────┤
│ onboarding_status: APPROVED (no change)                     │
│ crew_status:       ACTIVE → COMPLETED ✓                     │
│ sign_off_date:     [date filled] ✓                          │
│ exit_type:         'SUCCESSFUL' or 'BREAK_CONTRACT' ✓       │
│ exit_remarks:      [optional/required based on type] ✓      │
│ Action: "Edit Exit Details" button DISABLED (Locked)        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: FUTURE - PORTAGE BILL GENERATED FOR EXIT MONTH      │
├─────────────────────────────────────────────────────────────┤
│ onboarding_status: APPROVED (no change)                     │
│ crew_status:       COMPLETED → IN_ACTIVE ✓                  │
│ (to be implemented when PB generation endpoint is created)   │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Code Implementation Details

### Location: [app/dashboard/crew/page.tsx](app/dashboard/crew/page.tsx)

#### 4.1 Status Display Function
```typescript
// Line 522-536
const getCrewStatus = (member: CrewMember): { status: string; color: string } => {
    const status = member.crew_status || 'NEW';
    
    switch (status) {
        case 'NEW':
            return { status: 'New', color: 'bg-blue-100 text-blue-800' };
        case 'ACTIVE':
            return { status: 'Active', color: 'bg-green-100 text-green-800' };
        case 'COMPLETED':
            return { status: 'Completed', color: 'bg-purple-100 text-purple-800' };
        case 'IN_ACTIVE':
            return { status: 'In-Active', color: 'bg-gray-100 text-gray-800' };
        default:
            return { status: 'New', color: 'bg-blue-100 text-blue-800' };
    }
};
```
**Purpose**: Converts database value to display label and color  
**Usage**: Crew list table, crew details modal, status badges

---

#### 4.2 Approve Button Logic
```typescript
// Line 1246 - Crew List Table
{member.crew_status === 'NEW' && (
    <button onClick={() => handleApprove(member.id)}>
        Approve
    </button>
)}

// Line 1509 - Crew Details Modal
{selectedCrew.crew_status === 'NEW' && userRole === 'ADMIN' && (
    <button onClick={() => handleApprove(selectedCrew.id)}>
        Approve
    </button>
)}
```
**Condition**: Shows button only if `crew_status === 'NEW'`  
**Action**: Calls `handleApprove()` function

---

#### 4.3 Approve Handler
```typescript
// Line 400-413
const handleApprove = async (id: number) => {
    try {
        setApprovingId(id);
        const response = await fetch(`/api/crew/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                onboarding_status: 'APPROVED',
                crew_status: 'ACTIVE'
            })
        });
        
        // Refresh crew list
        await fetchCrew();
    } finally {
        setApprovingId(null);
    }
};
```
**Updates Both**: 
- `onboarding_status` → 'APPROVED'
- `crew_status` → 'ACTIVE'

---

#### 4.4 Edit Exit Details Button Logic
```typescript
// Line 1312-1322
{!isEditingExit && selectedCrew.crew_status !== 'COMPLETED' && (
    <button onClick={handleEditExit}>
        Edit Exit Details
    </button>
)}

{selectedCrew.crew_status === 'COMPLETED' && (
    <span>Exit Locked</span>
)}
```
**Conditions**:
- Button shows if: NOT editing AND status is NOT 'COMPLETED'
- "Exit Locked" badge shows if: status IS 'COMPLETED'

---

#### 4.5 Save Exit Details Handler
```typescript
// Line 445-475
const handleSaveExit = async () => {
    // Validation
    if (!exitEditData.sign_off_date.trim()) {
        alert('Sign-off date is required');
        return;
    }
    
    if (!exitEditData.exit_type) {
        alert('Exit type is required');
        return;
    }
    
    if (exitEditData.exit_type === 'BREAK_CONTRACT' && 
        !exitEditData.exit_remarks.trim()) {
        alert('Exit remarks required for break contract');
        return;
    }

    const response = await fetch(`/api/crew/${selectedCrew.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            sign_off_date: exitEditData.sign_off_date,
            sign_off_port: exitEditData.sign_off_port,
            exit_type: exitEditData.exit_type,
            exit_remarks: exitEditData.exit_remarks,
            crew_status: 'COMPLETED'  // ← Key transition here
        })
    });
    
    // Refresh and close modal
    await fetchCrew();
    setSelectedCrew(null);
    setIsEditingExit(false);
};
```
**Updates**:
- `crew_status` → 'COMPLETED'
- `sign_off_date`
- `exit_type` ('SUCCESSFUL' or 'BREAK_CONTRACT')
- `exit_remarks` (conditional)

---

#### 4.6 Filter Logic
```typescript
// Line 558-559
if (statusFilter !== 'All') {
    filtered = filtered.filter(member => member.crew_status === statusFilter);
}
```
**Filter Options** (Line 1128-1137):
- All
- New (crew_status = 'NEW')
- Active (crew_status = 'ACTIVE')
- Completed (crew_status = 'COMPLETED')
- In-Active (crew_status = 'IN_ACTIVE')

---

### API Implementation: [app/api/crew/[id]/route.ts](app/api/crew/%5Bid%5D/route.ts)

#### Field Handlers
```typescript
// Updates crew_status when provided
if (body.crew_status !== undefined) 
    updateData.crew_status = body.crew_status || null;

// Updates exit details
if (body.sign_off_date !== undefined) 
    updateData.sign_off_date = body.sign_off_date ? new Date(body.sign_off_date) : null;

if (body.exit_type !== undefined) 
    updateData.exit_type = body.exit_type || null;

if (body.exit_remarks !== undefined) 
    updateData.exit_remarks = body.exit_remarks || null;

// Updates approval status
if (body.onboarding_status !== undefined) 
    updateData.onboarding_status = body.onboarding_status || null;
```

---

## 5. Exit Type Field

**Table**: `crew_members`  
**Type**: VARCHAR(50)  
**Constraint**: Only set when `crew_status === 'COMPLETED'`

### Values

| Value | Icon | Color | Meaning |
|-------|------|-------|---------|
| **SUCCESSFUL** | ✓ | Green | Normal contract completion |
| **BREAK_CONTRACT** | ✗ | Red | Early exit / contract breach |

### Example SQL
```sql
-- Find all successful exits this month
SELECT id, name, sign_off_date 
FROM crew_members 
WHERE crew_status = 'COMPLETED' 
  AND exit_type = 'SUCCESSFUL'
  AND sign_off_date >= '2026-03-01'
  AND sign_off_date <= '2026-03-31';

-- Find all contract breaks
SELECT id, name, exit_remarks 
FROM crew_members 
WHERE exit_type = 'BREAK_CONTRACT';
```

---

## 6. Display in Crew List

### Exit Type Icon
Located next to sign-off date in crew list table ([Line 1220-1230](app/dashboard/crew/page.tsx#L1220-L1230)):
- Shows only if `sign_off_date` is set
- Shows only if `exit_type` is set
  - ✓ (green) = SUCCESSFUL
  - ✗ (red) = BREAK_CONTRACT

---

## 7. KPI Dashboard Integration

**Location**: [app/api/dashboard/kpis/route.ts](app/api/dashboard/kpis.route.ts)

```typescript
// Total Crew Onboard (using both statuses)
const totalCrewOnboard = await prisma.crewMember.count({
    where: { 
        onboarding_status: 'APPROVED',  // ← Must be approved
        sign_off_date: null             // ← Not yet exited
    }
});

// Crew Sign-on This Month
const crewSignOnThisMonth = await prisma.crewMember.count({
    where: {
        sign_on_date: { gte: firstDayOfMonth, lte: lastDayOfMonth }
    }
});

// Crew Sign-off This Month
const crewSignOffThisMonth = await prisma.crewMember.count({
    where: {
        sign_off_date: { gte: firstDayOfMonth, lte: lastDayOfMonth },
        crew_status: 'COMPLETED'  // ← Must be marked complete
    }
});
```

---

## 8. Key Business Rules

### Rule 1: Approval Gate
- **NEW crew** cannot have exit details edited
- Must be approved first → changes to **ACTIVE**
- Only ACTIVE crew can have exit details added

### Rule 2: Exit Lock
- Once exit details saved → `crew_status = 'COMPLETED'`
- "Edit Exit Details" button becomes disabled
- Shows "Exit Locked" badge instead
- Prevents accidental changes to finalized exit data

### Rule 3: Conditional Exit Remarks
- `exit_type = 'SUCCESSFUL'` → exit_remarks optional
- `exit_type = 'BREAK_CONTRACT'` → exit_remarks required
- Validation enforced in frontend and can be added to API

### Rule 4: Dual Tracking
- `onboarding_status` stays APPROVED even after exit
- `crew_status` progresses: NEW → ACTIVE → COMPLETED → IN_ACTIVE
- Allows historical tracking of approval + lifecycle

---

## 9. Future Implementation: IN_ACTIVE Status

**When to trigger**: When Portage Bill is generated for crew member's exit month

**Implementation Needed**:
1. Create endpoint: `/api/portage-bill/generate`
2. After PB saved, update crew_status:
```typescript
await prisma.crewMember.update({
    where: { id: crewId },
    data: { crew_status: 'IN_ACTIVE' }
});
```

---

## 10. Audit Trail

Both fields are logged in:
- **Table**: `activity_log`
- **Captured in**: `old_values` and `new_values` JSON fields
- Provides complete history of status changes

Query example:
```sql
SELECT 
    user_id,
    action,
    old_values->>'crew_status' as old_status,
    new_values->>'crew_status' as new_status,
    created_at
FROM activity_log
WHERE entity_type = 'CrewMember'
ORDER BY created_at DESC;
```

---

## Quick Reference Matrix

| Scenario | onboarding_status | crew_status | Can Approve? | Can Edit Exit? |
|----------|------------------|------------|-------------|----------------|
| New crew created | PENDING | NEW | ✅ Yes | ❌ No |
| After approval | APPROVED | ACTIVE | ❌ No | ✅ Yes |
| After exit saved | APPROVED | COMPLETED | ❌ No | ❌ No (Locked) |
| Future (PB generated) | APPROVED | IN_ACTIVE | ❌ No | ❌ No |

---

## References

- **Database**: [prisma/schema.prisma](prisma/schema.prisma)
- **UI Component**: [app/dashboard/crew/page.tsx](app/dashboard/crew/page.tsx)
- **API Endpoint**: [app/api/crew/[id]/route.ts](app/api/crew/%5Bid%5D/route.ts)
- **KPI Dashboard**: [app/api/dashboard/kpis/route.ts](app/api/dashboard/kpis/route.ts)

---

**Document Version**: 1.0  
**Last Updated**: March 7, 2026
