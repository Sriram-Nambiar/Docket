import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Name, email, and password are required' }, { status: 400 });
    }

    const isComplianceHead = role === 'compliance_head';
    
    const user = {
      id: `usr-${Date.now()}`,
      email: email,
      name: name,
      role: isComplianceHead ? 'compliance_head' : 'user',
      roleTitle: isComplianceHead ? 'Compliance Head' : 'Solo Founder / Department Collaborator',
      clearance: isComplianceHead 
        ? 'Tier 2 - Full Executive Confidential Clearance' 
        : 'Tier 1 - Prompt Intake & Task Scope',
      clearanceLevel: isComplianceHead ? 2 : 1,
      company: 'Apex Technologies Pvt Ltd',
      avatar: name.substring(0, 2).toUpperCase(),
      defaultView: isComplianceHead ? 'dashboard' : 'intake',
      token: `jwt_token_docket_${Date.now()}`
    };

    return NextResponse.json({
      success: true,
      user,
      message: 'Account registered successfully'
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
