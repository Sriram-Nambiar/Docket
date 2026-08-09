import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, password, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    const isComplianceHead = role === 'compliance_head' || email.includes('head') || email.includes('admin');
    
    const userRole = isComplianceHead ? 'compliance_head' : 'user';
    const roleTitle = isComplianceHead ? 'Compliance Head' : 'Solo Founder / Department Collaborator';
    const clearance = isComplianceHead 
      ? 'Tier 2 - Full Executive Confidential Clearance' 
      : 'Tier 1 - Prompt Intake & Task Scope';
    const clearanceLevel = isComplianceHead ? 2 : 1;

    const user = {
      id: `usr-${Date.now()}`,
      email: email,
      name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim() || (isComplianceHead ? 'Rajesh Sharma' : 'Swathi Founder'),
      role: userRole,
      roleTitle: roleTitle,
      clearance: clearance,
      clearanceLevel: clearanceLevel,
      company: 'Apex Technologies Pvt Ltd',
      avatar: (email.slice(0, 2) || 'US').toUpperCase(),
      defaultView: isComplianceHead ? 'dashboard' : 'intake',
      token: `jwt_token_docket_${Date.now()}`
    };

    return NextResponse.json({
      success: true,
      user,
      message: 'Authentication successful'
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
