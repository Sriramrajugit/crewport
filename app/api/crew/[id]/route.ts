import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withVesselAccess } from '@/lib/accessControl';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withVesselAccess(request, async (vesselId, userId) => {
        try {
            const { id } = await params;

            // Validate ID
            if (!id || isNaN(Number(id))) {
                return NextResponse.json({ error: 'Invalid crew member ID' }, { status: 400 });
            }

            const body = await request.json();

            // Verify crew member exists and belongs to this vessel
            const existing = await prisma.crewMember.findUnique({
                where: { id: Number(id) }
            });

            if (!existing || existing.vessel_id !== vesselId) {
                return NextResponse.json({ error: 'Crew member not found or access denied' }, { status: 403 });
            }

            const updateData: any = {};

            // Handle status update
            if (body.status) {
                updateData.onboarding_status = body.status;
                updateData.documents_verified_by = body.verified_by || null;
                if (body.status === 'APPROVED') {
                    updateData.verified_at = new Date();
                }
            }

            // Handle salary/deduction field updates
            if (body.basic_salary !== undefined) updateData.basic_salary = body.basic_salary ? parseFloat(body.basic_salary) : null;
            if (body.fixed_overtime !== undefined) updateData.fixed_overtime = body.fixed_overtime ? parseFloat(body.fixed_overtime) : null;
            if (body.leave_wages !== undefined) updateData.leave_wages = body.leave_wages ? parseFloat(body.leave_wages) : null;
            if (body.other_allowances !== undefined) updateData.other_allowances = body.other_allowances ? parseFloat(body.other_allowances) : null;
            if (body.travel_wages !== undefined) updateData.travel_wages = body.travel_wages ? parseFloat(body.travel_wages) : null;
            if (body.hra !== undefined) updateData.hra = body.hra ? parseFloat(body.hra) : null;
            if (body.joining_expenses !== undefined) updateData.joining_expenses = body.joining_expenses ? parseFloat(body.joining_expenses) : null;
            if (body.onboard_allowance_short_manning !== undefined) updateData.onboard_allowance_short_manning = body.onboard_allowance_short_manning ? parseFloat(body.onboard_allowance_short_manning) : null;
            if (body.total_earnings !== undefined) updateData.total_earnings = body.total_earnings ? parseFloat(body.total_earnings) : null;
            
            // Handle deduction field updates
            if (body.cash_drawn !== undefined) updateData.cash_drawn = body.cash_drawn ? parseFloat(body.cash_drawn) : null;
            if (body.home_allowance !== undefined) updateData.home_allowance = body.home_allowance ? parseFloat(body.home_allowance) : null;
            if (body.bond_deduction !== undefined) updateData.bond_deduction = body.bond_deduction ? parseFloat(body.bond_deduction) : null;
            if (body.other_deduction !== undefined) updateData.other_deduction = body.other_deduction ? parseFloat(body.other_deduction) : null;
            if (body.brought_forward !== undefined) updateData.brought_forward = body.brought_forward ? parseFloat(body.brought_forward) : null;

            // Handle exit date and port updates
            if (body.sign_off_date !== undefined) updateData.sign_off_date = body.sign_off_date ? new Date(body.sign_off_date) : null;
            if (body.sign_off_port !== undefined) updateData.sign_off_port = body.sign_off_port || null;
            if (body.exit_type !== undefined) updateData.exit_type = body.exit_type || null;
            if (body.exit_remarks !== undefined) updateData.exit_remarks = body.exit_remarks || null;
            if (body.crew_status !== undefined) updateData.crew_status = body.crew_status || null;

            const updated = await prisma.crewMember.update({
                where: { id: Number(id) },
                data: updateData,
            });

            return NextResponse.json({ message: 'Crew member updated', crew: updated });
        } catch (error) {
            console.error('Error updating crew member:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to update crew member';
            return NextResponse.json(
                { error: errorMessage, details: String(error) },
                { status: 500 }
            );
        }
    });
}
