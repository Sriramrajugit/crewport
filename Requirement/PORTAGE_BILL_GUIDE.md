# Portage Bill Report - User Guide

## Where to Find the Portage Bill

### Navigation Path:
1. **Login** to the Crewport application
2. Click on **Reports** (📈) in the left sidebar
3. You will see the **Portage Bill Report** displayed as the main report option
4. Click on the **Portage Bill** card to open the report

### Visual Location:
- **Sidebar Menu**: Look for "Reports" (6th item after Dashboard, Crew Management, Purchases, Bond, Master Data)
- **Report Page**: The Portage Bill appears as a large highlighted card at the top with orange/amber background color
- **Features**: Shows "Earnings", "Deductions", and "Final Balance" badges

## Portage Bill Features

### What's Included:
- **Vessel Selection**: Choose the vessel for which you want to generate the report
- **Month & Year**: Select the month and year for the Portage Bill
- **Crew Grouping**: Automatically groups crew into:
  - **Officers** (TOTAL A)
  - **Ratings** (TOTAL B)
  - **Grand Total** (TOTAL A+B)

### Earnings Columns:
- Basic Salary
- Fixed Overtime
- Leave Wages
- Other Allowances
- Travel Wages
- HRA (House Rent Allowance)
- Joining Expenses
- Onboard Allowance / Short Manning
- **Total Earnings**

### Deduction Columns:
- Cash Drawn On
- Home Allowance
- Bond
- Other Deduction
- **Total Deduction**
- Brought Forward
- **Final Balance**

### Actions:
- **Print Report**: Click the "🖨️ Print Report" button to print or save as PDF
- The report is optimized for printing with proper formatting and colors

## Database Schema

New fields added to `crew_members` table:
- `cash_drawn` - Amount of cash drawn
- `home_allowance` - Home allowance deduction
- `bond_deduction` - Bond/bonded stores deduction
- `other_deduction` - Other miscellaneous deductions
- `brought_forward` - Balance brought forward from previous period

## API Endpoints

### GET /api/crew
- Fetches all crew members for the selected vessel
- Returns crew information with all salary and deduction fields

### PUT /api/crew/[id]
- Updates crew member information
- Supports updating salary and deduction fields

## Example Flow

1. Navigate to Reports → Portage Bill
2. Select a Vessel (e.g., "MT EXAMPLE SHIP")
3. Select Month (e.g., "03" for March) and Year (e.g., "2026")
4. The report automatically calculates:
   - Total Earnings for each crew member
   - Total Deductions for each crew member
   - Final Balance (Earnings - Deductions + Brought Forward)
5. View totals by category (Officers, Ratings, Grand Total)
6. Click "Print Report" to generate/download the report

## Features Available

✅ Crew earning and deduction calculation
✅ Grouped reporting by rank category
✅ Automatic total calculations
✅ Print-friendly layout
✅ Monthly reporting capability
✅ Multiple vessel support

## Notes

- All calculations are done in real-time as crew data is fetched
- The report respects the database decimal precision (2 decimal places)
- Null/empty values are displayed as "-" for clarity
- The report is optimized for A4 paper size printing
