const baselineCompliances = [
  { name: 'GST registration and GSTR-1 / GSTR-3B returns', authority: 'CBIC / GSTN', freq: 'Monthly' },
  { name: 'Form AOC-4 financial statements', authority: 'Ministry of Corporate Affairs', freq: 'Annual' },
  { name: 'Form MGT-7 annual return', authority: 'Ministry of Corporate Affairs', freq: 'Annual' },
  { name: 'DIR-3 KYC verification', authority: 'Ministry of Corporate Affairs', freq: 'Annual · 30 September' },
  { name: 'Income-tax return (ITR-6)', authority: 'Income Tax Department', freq: 'Annual' },
];

export function getLocalIntakeAnalysis({ businessDescription = '', sector = 'General business' } = {}) {
  const description = businessDescription.toLowerCase();
  const isInvestmentReady = /saas|technology|software|startup|fund|invest|equity|global|export/.test(description);
  const bestMatch = isInvestmentReady ? 'Private Limited Company' : 'Limited Liability Partnership';

  return {
    bestMatch,
    matchScore: isInvestmentReady ? '89%' : '82%',
    rationale: `${bestMatch} is the local baseline recommendation for the supplied ${sector} profile. Confirm ownership, turnover, state registrations, and sector-specific licenses with a qualified professional before acting.`,
    pros: isInvestmentReady ? ['Limited liability', 'Suitable for equity investment', 'ESOP-ready structure'] : ['Limited liability', 'Lower ongoing formalities', 'Flexible partner management'],
    cons: ['Statutory filings and tax obligations still depend on your actual business facts.'],
    mandatoryCompliances: baselineCompliances,
  };
}

export function getLocalExtraction({ text = '', fileName = '' } = {}) {
  const source = `${fileName} ${text}`.toLowerCase();
  const documentType = source.includes('gst') ? 'GST registration or return' : source.includes('incorporation') || source.includes('cin') ? 'Certificate of incorporation' : source.includes('board resolution') ? 'Board resolution' : source.includes('tax') || source.includes('itr') ? 'Tax document' : 'Business document';
  const cin = text.match(/\b[A-Z]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}\b/i)?.[0];
  const gstin = text.match(/\b\d{2}[A-Z]{5}\d{4}[A-Z]\d[A-Z\d]Z[A-Z\d]\b/i)?.[0];

  return {
    documentType,
    entities: {
      ...(cin ? { CIN: cin } : {}),
      ...(gstin ? { GSTIN: gstin } : {}),
      sourceFile: fileName || 'Uploaded document',
    },
    matchedRules: documentType.includes('GST') ? [{ ruleId: 'IN-GST-GSTR3B-004', ruleName: 'GST return review', status: 'Needs verification' }] : [],
    gaps: ['Local analysis only — verify extracted details and applicable rules before filing.'],
    confidence: 'Limited local analysis',
  };
}

export function getLocalQueryResponse(prompt = '') {
  return `The AI provider is not configured, so this is a local workspace response. Review the Rule Library and the relevant checklist for: “${prompt.slice(0, 160)}”. For any filing or statutory decision, confirm the current rule and due date with a qualified compliance professional.`;
}
