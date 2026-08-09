import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Docket PostgreSQL database...');

  // Seed Users
  const founder = await prisma.user.upsert({
    where: { email: 'ankit@apextech.in' },
    update: {},
    create: {
      email: 'ankit@apextech.in',
      name: 'Ankit Sharma',
      role: 'founder',
      avatar: 'AS',
      defaultView: 'intake',
    },
  });

  const complianceHead = await prisma.user.upsert({
    where: { email: 'rajesh@docket.legal' },
    update: {},
    create: {
      email: 'rajesh@docket.legal',
      name: 'Rajesh Sharma',
      role: 'compliance_head',
      avatar: 'CH',
      defaultView: 'dashboard',
    },
  });

  // Seed Statutory Rules
  const rules = [
    {
      ruleCode: 'IN-GST-GSTR3B-004',
      title: 'GSTR-3B Monthly Return',
      act: 'CGST Act 2017',
      section: 'Section 47',
      fixedFee: 0,
      dailyRate: 50,
      statute: 'CGST Act Section 47',
      description: 'Monthly self-assessment return for summary GST liabilities.',
      escalationDays: 11,
    },
    {
      ruleCode: 'IN-MCA-AOC4-001',
      title: 'Form AOC-4 Financial Statements',
      act: 'Companies Act 2013',
      section: 'Section 137',
      fixedFee: 0,
      dailyRate: 100,
      statute: 'Companies Act Section 137(3)',
      description: 'Annual filing of audited financial statements with ROC.',
      escalationDays: 14,
    },
    {
      ruleCode: 'IN-MCA-DIR3KYC-002',
      title: 'DIR-3 KYC Director Annual Return',
      act: 'Companies Rules 2014',
      section: 'Rule 12A',
      fixedFee: 5000,
      dailyRate: 0,
      statute: 'Companies Rules 2014, Rule 12A',
      description: 'Annual KYC verification for all assigned Director Identification Numbers.',
      escalationDays: 30,
    },
  ];

  for (const rule of rules) {
    await prisma.statutoryRule.upsert({
      where: { ruleCode: rule.ruleCode },
      update: rule,
      create: rule,
    });
  }

  // Seed Default Tasks
  const initialTasks = [
    {
      title: 'GSTR-3B Monthly Return (July 2026)',
      category: 'GST Compliance',
      entity: 'Apex Technologies Pvt Ltd',
      section: 'CGST Act Sec 39',
      act: 'CGST Act 2017',
      dueDate: '2026-08-20',
      status: 'NotStarted',
      accruedPenalty: 14600,
      dailyRate: 50,
      whatsappAlert: true,
      userId: founder.id,
    },
    {
      title: 'Form AOC-4 Annual Financial Filing',
      category: 'MCA Compliance',
      entity: 'Apex Technologies Pvt Ltd',
      section: 'Companies Act Sec 137',
      act: 'Companies Act 2013',
      dueDate: '2026-10-30',
      status: 'EvidenceUploaded',
      accruedPenalty: 0,
      dailyRate: 100,
      whatsappAlert: true,
      userId: complianceHead.id,
    },
  ];

  for (const task of initialTasks) {
    const existing = await prisma.task.findFirst({ where: { title: task.title } });
    if (!existing) {
      await prisma.task.create({ data: task });
    }
  }

  console.log('PostgreSQL database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
