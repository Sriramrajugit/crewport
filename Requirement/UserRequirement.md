User Requirement

Sree, your problem is a classic multi-tenant hierarchy with cross-company users. The clean solution is to separate Company, Vessel, and User mapping using junction tables.
Let me explain the recommended logic + DB design for your React + Node + PostgreSQL application.
________________________________________
1. Core Business Rules (From your requirement)
1.	One Company → Many Vessels
2.	One Vessel → Only One Company
3.	One User → Multiple Vessels
4.	User vessels may belong to different companies
5.	Users are NOT assigned to companies directly
6.	Access control is Vessel based
So the Vessel becomes the central access control entity.
________________________________________
2. Entity Relationship (Concept)
Company
   |
   | 1:N
   |
Vessel
   |
   | N:M
   |
User
Because users can access multiple vessels, we need a mapping table.
________________________________________
3. Database Design (PostgreSQL)
1️⃣ Company Table
companies
---------
id (PK)
company_name
company_code
address
created_at
status
________________________________________
2️⃣ Vessel Table
vessels
---------
id (PK)
vessel_name
imo_number
company_id (FK -> companies.id)
vessel_type
flag
created_at
status
Rule enforced:
1 vessel belongs to 1 company
________________________________________
3️⃣ Users Table
users
---------
id (PK)
name
email
password_hash
role
status
created_at
No company reference here.
________________________________________
4️⃣ User Vessel Mapping (IMPORTANT)
user_vessels
--------------
id (PK)
user_id (FK -> users.id)
vessel_id (FK -> vessels.id)
role_on_vessel
created_at
This solves your complexity.
Example data:
user	vessel	company
Admin1	Vessel A	Company 1
Admin1	Vessel B	Company 2
Admin1	Vessel C	Company 3
Perfectly valid.
________________________________________
4. Example Scenario
Companies
id	name
1	Maersk
2	MSC
________________________________________
Vessels
id	vessel	company
1	Ocean Star	1
2	Blue Whale	1
3	Sea Dragon	2
________________________________________
User Vessel Mapping
user	vessel
Admin	Ocean Star
Admin	Sea Dragon
Result:
Admin manages two vessels from two companies
No issue.
________________________________________
5. Access Logic (Backend)
When user logs in:
SELECT vessel_id
FROM user_vessels
WHERE user_id = X
Then load vessels:
SELECT v.*
FROM vessels v
JOIN user_vessels uv ON uv.vessel_id = v.id
WHERE uv.user_id = X
Now your UI shows:
My Vessels
-----------
Ocean Star (Company A)
Sea Dragon (Company B)
________________________________________
6. UI Logic
After login show:
Select Vessel
Because all modules depend on vessel.
Example:
Dashboard
   ↓
Select Vessel
   ↓
Crew
Victualling
Bond Store
Portage Bill
Everything becomes vessel scoped.
________________________________________
7. Role Extension (Recommended)
You may also want roles per vessel.
Example:
Master
Chief Engineer
Company Admin
Viewer
Add in mapping table:
role_on_vessel
________________________________________
8. ER Diagram (Simple)
Users
  |
  | 1:N
  |
User_Vessels
  |
  | N:1
  |
Vessels
  |
  | N:1
  |
Companies


Sree, for your requirement the Admin User Management screen should make two things very easy:
1.	Create a new user
2.	Map the user to one or more vessels (across companies)
Since access is vessel-based, the UI should focus on vessel selection, not company selection.
Below is a practical screen design you can directly implement in React.
________________________________________
1. Admin → User Management Screen
Page Layout
--------------------------------------------------------
Admin Panel
--------------------------------------------------------
Users | Vessels | Companies | Reports
--------------------------------------------------------

User List
--------------------------------------------------------
Search User: [__________]

Name        Email                Vessels     Status  Action
--------------------------------------------------------
John        john@mail.com        3           Active  Edit
Ravi        ravi@mail.com        2           Active  Edit
Maria       maria@mail.com       5           Active  Edit

[ + Create New User ]
--------------------------------------------------------
Click Create New User
________________________________________
2. Create User Screen
Split screen layout (very easy UX).
--------------------------------------------------------
Create User
--------------------------------------------------------

User Details
--------------------------------------------------------
Name              : [____________]
Email             : [____________]
Password          : [____________]
Role              : [Admin / Vessel User / Viewer]
Status            : [Active / Disabled]

--------------------------------------------------------
Assign Vessels
--------------------------------------------------------

Search Vessel : [__________]

Company         Vessel Name        Select
--------------------------------------------------------
Maersk          Ocean Star         [✓]
Maersk          Blue Whale         [ ]
MSC             Sea Dragon         [✓]
MSC             Atlantic Queen     [ ]
Shell           Arctic Wind        [ ]

--------------------------------------------------------

Selected Vessels
--------------------------------------------------------
Ocean Star
Sea Dragon

--------------------------------------------------------

[ Save User ]
[ Cancel ]
________________________________________
3. Even Better UX (Tree View)
If vessels grow large, use Company → Vessel tree.
Assign Vessels

[ ] Maersk
      [✓] Ocean Star
      [ ] Blue Whale
      [ ] Pacific Queen

[ ] MSC
      [✓] Sea Dragon
      [ ] Atlantic Queen

[ ] Shell
      [ ] Arctic Wind
Admin simply checks vessels.
________________________________________
4. Database Save Logic
When Save User clicked:
Step 1 — Insert User
INSERT INTO users(name,email,password_hash,role)
VALUES($1,$2,$3,$4)
RETURNING id;
________________________________________
Step 2 — Insert Vessel Mapping
For each selected vessel:
INSERT INTO user_vessels(user_id, vessel_id)
VALUES ($USER_ID, $VESSEL_ID);
________________________________________
5. Edit User Screen
Admin must also add/remove vessels.
------------------------------------------------
Edit User : John
------------------------------------------------

Assigned Vessels

Ocean Star         [Remove]
Sea Dragon         [Remove]

Add More Vessels

Search Vessel : [_____]

[ ] Blue Whale
[ ] Atlantic Queen

[ Save Changes ]
________________________________________
6. Super Admin Logic (Important)
Your Admin user should bypass vessel filtering.
Option 1 (Best):
role = SUPER_ADMIN
Backend check:
if role == SUPER_ADMIN
    return all vessels
else
    return mapped vessels
________________________________________
7. Recommended Roles
SUPER_ADMIN
COMPANY_ADMIN
VESSEL_USER
VIEWER
But for now you only need:
ADMIN
USER

Best Dashboard Flow
Login →
If Admin
     → Admin Dashboard
If User
     → Select Vessel

