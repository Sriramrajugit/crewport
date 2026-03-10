# Role-Based Access Control (RBAC) System Documentation

**Last Updated**: March 7, 2026  
**Version**: 1.0  
**System**: Crewport - Vessel Fleet Management

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [User Roles](#user-roles)
5. [Access Flow](#access-flow)
6. [Vessel Selection & Context](#vessel-selection--context)
7. [API Middleware](#api-middleware)
8. [Implementation Guide](#implementation-guide)
9. [Security Considerations](#security-considerations)
10. [Testing Checklist](#testing-checklist)

---

## System Overview

**Purpose**: Control which users can access which vessels and their data  
**Model**: Multi-tenant with vessel-based access control  
**Key Principle**: Access is vessel-scoped, not company-scoped

### Core Relationships

```
Company
   ↓ 1:N
Vessel
   ↓ N:M (via user_vessels junction table)
User
```

**Key Rules**:
- 1 Company → Many Vessels
- 1 Vessel → 1 Company (fixed)
- 1 User → Many Vessels (can span companies)
- All data access is vessel-scoped

---

## Architecture

### High-Level Flow

```
Login
  ↓
API /auth/me returns user + assigned_vessels
  ↓
FrontendVesselContext loads vessels
  ↓
User selects vessel from dropdown
  ↓
Context stores selectedVessel globally
  ↓
All API calls include X-Vessel-Id header
  ↓
Backend validates access via middleware
  ↓
Data returned for selected vessel only
```

### Component Architecture

```
App Layout
  └── VesselProvider (Context)
      └── Dashboard Layout
          ├── Vessel Selector (header)
          └── Page Components
              └── API calls with vessel context
```

---

## Database Schema

### 1. users Table
```sql
id (PK)
name
email
password_hash
role_id (FK → users_roles)
company_id (FK → companies) -- User's primary company
vessel_id (FK → vessels) -- Legacy, deprecated (use user_vessels)
is_active
created_at
deleted_at
```

**Note**: `vessel_id` is deprecated. Use `user_vessels` junction table instead.

### 2. user_vessels Table (NEW)
```sql
id (PK)
user_id (FK → users) -- Required
vessel_id (FK → vessels) -- Required
role_on_vessel (VARCHAR 50) -- e.g., "VESSEL_USER", "VESSEL_ADMIN"
is_active (BOOLEAN) -- Soft delete for vessel access
created_at
updated_at

UNIQUE(user_id, vessel_id) -- One user per vessel assignment
```

**Purpose**: Enable N:M relationship between users and vessels

**Example Data**:
```
user_id | vessel_id | role_on_vessel | is_active
--------|-----------|----------------|----------
1       | 101       | VESSEL_USER    | true
1       | 102       | VESSEL_USER    | true
1       | 103       | VESSEL_USER    | true
2       | 101       | VESSEL_USER    | true
3       | 102       | VESSEL_ADMIN   | true
```

Result: User 1 can access 3 vessels, User 2 accesses only vessel 101, etc.

### 3. vessels Table
```sql
id (PK)
vessel_name
company_id (FK → companies) -- Fixed: one vessel = one company
imo_number
vessel_type
status ('ACTIVE' | 'INACTIVE')
created_at
```

### 4. companies Table
```sql
id (PK)
company_name
company_code
is_active
created_at
```

### 5. users_roles Table
```sql
id (PK)
role_name (UNIQUE) -- "ADMIN", "VESSEL_USER", "VIEWER", etc.
description
permissions (JSON)
created_at
```

---

## User Roles

### Current Roles

| Role | Description | Vessel Access | Admin Panel |
|------|-------------|----------------|------------|
| **SUPER_ADMIN** | Full system access, bypass all filters | All vessels | Yes |
| **ADMIN** | Company/Fleet admin, can approve requests | All vessels | Yes |
| **VESSEL_USER** | Crew manager, can manage vessel data | Assigned vessels only | No |
| **VIEWER** | Read-only access | Assigned vessels only | No |

### Role Permissions

**SUPER_ADMIN** / **ADMIN**:
- ✅ Manage users & assign vessels
- ✅ View all vessels
- ✅ Approve earnings, purchases
- ✅ Generate reports
- ✅ Manage exchange rates

**VESSEL_USER**:
- ✅ Manage crew for assigned vessels
- ✅ Upload documents (contracts, invoices)
- ✅ Manage purchases & bond for assigned vessels
- ❌ Cannot approve purchases
- ❌ Cannot assign users
- ❌ Cannot view other vessels

**VIEWER**:
- ✅ View crew data (read-only)
- ✅ View reports (read-only)
- ❌ Cannot edit anything
- ❌ Cannot upload documents

---

## Access Flow

### Step 1: User Login → Get Profile

**Request**:
```
GET /api/auth/me
```

**Response**:
```json
{
  "id": 1,
  "name": "John Manager",
  "email": "john@company.com",
  "role": "VESSEL_USER",
  "is_admin": false,
  "assigned_vessels": [
    {
      "vessel_id": 101,
      "vessel_name": "Ocean Star",
      "company_name": "Maersk",
      "role_on_vessel": "VESSEL_USER"
    },
    {
      "vessel_id": 102,
      "vessel_name": "Blue Whale",
      "company_name": "Maersk",
      "role_on_vessel": "VESSEL_USER"
    }
  ],
  "permissions": []
}
```

**Location**: [app/api/auth/me/route.ts](app/api/auth/me/route.ts)

### Step 2: Frontend Loads VesselContext

**Component**: [app/context/VesselContext.tsx](app/context/VesselContext.tsx)

```typescript
export function VesselProvider({ children }) {
    const [selectedVessel, setSelectedVessel] = useState(null);
    const [assignedVessels, setAssignedVessels] = useState([]);
    
    useEffect(() => {
        // Fetch /api/auth/me
        // Set assignedVessels from response
        // Auto-select first vessel: setSelectedVessel(assignedVessels[0])
    }, []);
}
```

### Step 3: User Selects Vessel

**UI Location**: Dashboard header (sticky)

```tsx
<select 
    value={selectedVessel?.vessel_id} 
    onChange={(e) => setSelectedVessel(...)}
>
    {assignedVessels.map(v => (
        <option>{v.vessel_name} ({v.company_name})</option>
    ))}
</select>
```

### Step 4: API Calls Include Vessel ID

**Method 1: Via Header** (Recommended)
```typescript
const response = await fetch('/api/crew', {
    headers: {
        'X-Vessel-Id': selectedVessel.vessel_id
    }
});
```

**Method 2: Via Query Parameter**
```typescript
const response = await fetch(`/api/crew?vesselId=${selectedVessel.vessel_id}`);
```

### Step 5: Backend Validates Access

**Middleware**: [lib/accessControl.ts](lib/accessControl.ts)

```typescript
export async function withVesselAccess(request, handler) {
    const vesselId = getVesselIdFromRequest(request);
    const userId = getUserIdFromRequest(request);
    
    // Validate: Does this user have access to this vessel?
    const access = await validateVesselAccess(userId, vesselId);
    
    if (!access.allowed) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    
    // Call handler with validated vesselId
    return handler(vesselId, userId);
}
```

### Step 6: Data Returned Vessel-Scoped

**Example: Crew List API**
```typescript
// /api/crew route handler

// Request includes X-Vessel-Id: 101
// Only returns crew for vessel 101
const crew = await prisma.crewMember.findMany({
    where: {
        vessel_id: 101,  // ← Always filtered by vessel
        deleted_at: null
    }
});
```

---

## Vessel Selection & Context

### VesselContext Hook

**Location**: [app/context/VesselContext.tsx](app/context/VesselContext.tsx)

**Usage in Components**:
```typescript
import { useVessel } from '@/app/context/VesselContext';

export function CrewPage() {
    const { selectedVessel, assignedVessels, loading } = useVessel();
    
    if (!selectedVessel) return <div>Select a vessel</div>;
    
    // Fetch crew for selectedVessel
    const crew = await fetch(`/api/crew?vesselId=${selectedVessel.vessel_id}`);
}
```

**Available Methods**:
```typescript
useVessel() → {
    selectedVessel: AssignedVessel | null,
    setSelectedVessel: (vessel) => void,
    assignedVessels: AssignedVessel[],
    setAssignedVessels: (vessels) => void,
    loading: boolean,
    error: string | null
}
```

### Dashboard Layout Integration

**Location**: [app/dashboard/layout.tsx](app/dashboard/layout.tsx)

**Features**:
- ✅ Wraps VesselProvider around dashboard
- ✅ Shows vessel selector in header
- ✅ Auto-selects first vessel on load
- ✅ Handles loading/error states

---

## API Middleware

### Access Control Utility

**Location**: [lib/accessControl.ts](lib/accessControl.ts)

#### Function: validateVesselAccess()
```typescript
async function validateVesselAccess(
    userId: number, 
    vesselId: number
): Promise<{ allowed: boolean; error?: string }>
```

**Logic**:
1. Fetch user + role
2. If role is ADMIN/SUPER_ADMIN → allow
3. Else check user_vessels table
4. If mapping exists AND is_active=true → allow
5. Else deny

#### Function: withVesselAccess()
```typescript
async function withVesselAccess(
    request: NextRequest,
    handler: (vesselId, userId) => Promise<NextResponse>
): Promise<NextResponse>
```

**Usage in Endpoints**:
```typescript
// /api/crew/[id]/route.ts
export async function PUT(request, { params }) {
    return withVesselAccess(request, async (vesselId, userId) => {
        const id = await params.id;
        
        // Logic here: update crew member
        // Will only work if crew belongs to vesselId
        
        return NextResponse.json({ success: true });
    });
}
```

### Header-Based Vessel ID

**Header Name**: `X-Vessel-Id`  
**Type**: Integer  
**Required**: For vessel-scoped endpoints  
**Example**:
```
GET /api/crew HTTP/1.1
X-Vessel-Id: 101
```

---

## Implementation Guide

### 1. Create User & Assign Vessels

**API**: POST /api/users

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@company.com",
    "password": "SecurePass123",
    "is_active": true,
    "selected_vessels": [101, 102]
  }'
```

**Response**:
```json
{
  "id": 5,
  "name": "Jane Doe",
  "email": "jane@company.com",
  "user_vessels": [
    { "vessel_id": 101, "role_on_vessel": "VESSEL_USER" },
    { "vessel_id": 102, "role_on_vessel": "VESSEL_USER" }
  ]
}
```

**UI**: [app/dashboard/master/users/page.tsx](app/dashboard/master/users/page.tsx)

### 2. Update User Vessel Access

**API**: PUT /api/users/:id

```bash
curl -X PUT http://localhost:3000/api/users/5 \
  -H "Content-Type: application/json" \
  -d '{
    "selected_vessels": [101, 102, 103]
  }'
```

### 3. Add Vessel Access Control to Existing Endpoints

**Before**:
```typescript
// /api/crew/[id]/route.ts
export async function PUT(request, { params }) {
    const id = await params.id;
    const body = await request.json();
    
    const crew = await prisma.crewMember.update({
        where: { id },
        data: body
    });
    
    return NextResponse.json(crew);
}
```

**After** (with access control):
```typescript
// /api/crew/[id]/route.ts
export async function PUT(request, { params }) {
    return withVesselAccess(request, async (vesselId, userId) => {
        const id = await params.id;
        const body = await request.json();
        
        // Verify crew belongs to this vessel
        const crew = await prisma.crewMember.findUnique({
            where: { id }
        });
        
        if (!crew || crew.vessel_id !== vesselId) {
            return NextResponse.json(
                { error: 'Crew not found or access denied' },
                { status: 403 }
            );
        }
        
        const updated = await prisma.crewMember.update({
            where: { id },
            data: body
        });
        
        return NextResponse.json(updated);
    });
}
```

### 4. Frontend: Call APIs with Vessel Context

**Before**:
```typescript
const crew = await fetch('/api/crew');
```

**After** (with vessel context):
```typescript
const { selectedVessel } = useVessel();

const crew = await fetch('/api/crew', {
    headers: {
        'X-Vessel-Id': selectedVessel.vessel_id
    }
});
```

---

## API Endpoints Reference

### Authentication
| Endpoint | Method | Response | Auth |
|----------|--------|----------|------|
| /api/auth/me | GET | User + vessels | Required |

### User Management
| Endpoint | Method | Required | Auth |
|----------|--------|----------|------|
| /api/users | GET | None | ADMIN |
| /api/users | POST | name, email, password, selected_vessels | ADMIN |
| /api/users/:id | GET | id | ADMIN |
| /api/users/:id | PUT | id + fields | ADMIN |
| /api/users/:id | DELETE | id | ADMIN |

### Crew (Vessel-Scoped)
| Endpoint | Method | Header | Auth |
|----------|--------|--------|------|
| /api/crew | GET | X-Vessel-Id | Required |
| /api/crew/:id | PUT | X-Vessel-Id | Required |

### Masters
| Endpoint | Method | Response |
|----------|--------|----------|
| /api/masters/companies | GET | All companies |
| /api/masters/vessels | GET | All vessels |
| /api/masters/roles | GET | All roles |

---

## Security Considerations

### 1. Always Validate Vessel Access
Every endpoint that uses vessel-scoped data should validate access:
```typescript
const access = await validateVesselAccess(userId, vesselId);
```

### 2. User Session / Token
Currently using mock userId = 1. In production:
- Use JWT tokens or session cookies
- Extract userId from token in `getUserIdFromRequest()`
- Validate token signature

### 3. SQL Injection Prevention
- Always use Prisma ORM (prevents SQL injection)
- Never concatenate user input into queries

### 4. Authorization vs Authentication
- **Authentication** (Who are you?) - Validate user via password
- **Authorization** (What can you do?) - Check via `validateVesselAccess()`

### 5. Data Isolation
- Always filter by vessel_id in WHERE clause
- Never return data from other vessels
- Use middleware to enforce this

---

## Testing Checklist

### Unit Tests

- [ ] validateVesselAccess() allows ADMIN for any vessel
- [ ] validateVesselAccess() allows USER for assigned vessels
- [ ] validateVesselAccess() denies USER for unassigned vessels
- [ ] getVesselIdFromRequest() extracts from header
- [ ] getVesselIdFromRequest() extracts from query param

### Integration Tests

- [ ] Create user → assign vessels → login → get profile
- [ ] Profile returns correct assigned_vessels
- [ ] Vessel selector loads in dashboard header
- [ ] Changing vessel selector updates context
- [ ] API calls include X-Vessel-Id header
- [ ] Crew list filters by vessel
- [ ] User cannot access other user's vessels

### Security Tests

- [ ] ADMIN can access all vessels
- [ ] USER cannot access unassigned vessel
- [ ] Missing X-Vessel-Id header returns 400
- [ ] Invalid vessel ID returns 403
- [ ] Soft-deleted vessel access is denied

### UI/UX Tests

- [ ] Vessel selector appears in dashboard header
- [ ] Cannot submit form without selecting vessel
- [ ] Switching vessel updates all page data
- [ ] Error shown when no vessels assigned
- [ ] Loading state shown while fetching vessels

---

## File References

### Context & Providers
- [app/context/VesselContext.tsx](app/context/VesselContext.tsx) - Vessel context provider

### Layouts
- [app/dashboard/layout.tsx](app/dashboard/layout.tsx) - Dashboard layout with vessel selector

### APIs
- [app/api/auth/me/route.ts](app/api/auth/me/route.ts) - Profile endpoint (returns vessels)
- [app/api/users/route.ts](app/api/users/route.ts) - User CRUD
- [app/api/users/[id]/route.ts](app/api/users/[id]/route.ts) - User details/update
- [app/api/crew/route.ts](app/api/crew/route.ts) - Crew list (vessel-scoped)

### Utilities
- [lib/accessControl.ts](lib/accessControl.ts) - Middleware & validation functions
- [lib/apiHelper.ts](lib/apiHelper.ts) - Client-side API helper

### Admin UI
- [app/dashboard/master/users/page.tsx](app/dashboard/master/users/page.tsx) - User management page

---

## Troubleshooting

### Issue: "No vessels assigned"
**Cause**: User has no entries in user_vessels table  
**Solution**: Use admin panel to assign vessels to user

### Issue: "Access denied" error in API
**Cause**: User doesn't have access to requested vessel  
**Check**:
1. User ID correct in request?
2. Vessel ID correct in X-Vessel-Id header?
3. Entry exists in user_vessels table?
4. is_active=true in user_vessels?

### Issue: Vessel selector shows wrong data
**Cause**: VesselContext not loading properly  
**Check**:
1. VesselProvider wrapping dashboard?
2. /api/auth/me returning vessels?
3. Browser console for errors?

---

**Document Version**: 1.0  
**Last Updated**: March 7, 2026  
**Next Review**: When adding new role types or changing access patterns
