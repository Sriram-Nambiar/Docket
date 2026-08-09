import { NextResponse } from 'next/server';

/**
 * POST /api/penalty
 * 
 * Real-time penalty calculator powered by NVIDIA NIM (Llama 3.1 70B).
 * Parses statutory penalty clauses into structured, plain-English breakdowns.
 * Falls back to deterministic local computation if NIM is unavailable.
 */
export async function POST(req) {
  try {
    const {
      filingType,
      authority,
      dueDate,
      currentDate,
      penaltySeverity,
      citation,
      statuteText
    } = await req.json();

    const apiKey = process.env.NVIDIA_API_KEY;
    const baseUrl = process.env.NIM_BASE_URL || 'https://integrate.api.nvidia.com/v1';
    const model = process.env.NIM_MODEL || 'meta/llama-3.1-70b-instruct';

    // Calculate days late
    const due = new Date(dueDate);
    const current = new Date(currentDate || new Date().toISOString().split('T')[0]);
    const daysLate = Math.max(0, Math.ceil((current - due) / (1000 * 60 * 60 * 24)));
    const daysUntilDue = Math.ceil((due - current) / (1000 * 60 * 60 * 24));

    // If NIM API key is available and statute text is provided, use AI parsing
    if (apiKey && statuteText && statuteText.trim().length > 10) {
      try {
        const prompt = `You are a precise Indian statutory penalty calculator. Given the following penalty clause from Indian law, compute the exact penalty exposure.

Filing Type: ${filingType}
Authority: ${authority}
Due Date: ${dueDate}
Current Date: ${currentDate || new Date().toISOString().split('T')[0]}
Days Late: ${daysLate}
Penalty Severity (1-5 scale): ${penaltySeverity || 'Unknown'}
Statutory Citation: ${citation || 'Not provided'}

PENALTY CLAUSE TEXT:
"${statuteText}"

Output ONLY valid JSON with these exact keys:
{
  "dailyPenaltyRate": <number in ₹ per day, 0 if not daily>,
  "totalAccrued": <number in ₹ total penalty so far>,
  "daysLate": ${daysLate},
  "nextEscalationDays": <number of days until the next penalty tier kicks in, e.g. prosecution, compound interest, registration cancellation>,
  "escalationType": "<human-readable: e.g. 'prosecution risk', 'interest compounding', 'registration cancellation', 'show cause notice'>",
  "plainEnglishSummary": "<one-line summary e.g. '₹200/day late fee, ₹14,600 accrued, escalates to prosecution risk in 11 days'>",
  "severityLevel": "<'warning' | 'critical' | 'prosecution_risk'>",
  "maxCap": <number in ₹ if there is a maximum cap, null if none>,
  "additionalCharges": "<string describing interest, compounding, or other charges if any>"
}

Be precise with Indian statutory amounts. If a daily rate is mentioned, multiply by ${daysLate} days. If there is a maximum cap, ensure totalAccrued does not exceed it.`;

        const response = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.05,
            max_tokens: 600,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const rawContent = data.choices?.[0]?.message?.content || '';

          let parsedResult = null;
          try {
            const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              parsedResult = JSON.parse(jsonMatch[0]);
            }
          } catch (parseErr) {
            // Fall through to local computation
          }

          if (parsedResult && parsedResult.plainEnglishSummary) {
            return NextResponse.json({
              success: true,
              penalty: parsedResult,
              source: 'nvidia_nim',
              model: model,
              aiGenerated: true,
              timestamp: new Date().toISOString(),
            });
          }
        }
      } catch (nimError) {
        // Fall through to local computation
        console.warn('NIM API call failed, using local fallback:', nimError.message);
      }
    }

    // ─── Local deterministic fallback computation ───
    const penaltyResult = computeLocalPenalty(filingType, daysLate, daysUntilDue, penaltySeverity);

    return NextResponse.json({
      success: true,
      penalty: penaltyResult,
      source: 'local_computation',
      aiGenerated: false,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Deterministic local penalty computation using known Indian statutory rates.
 * Used as fallback when NIM is unavailable or no statute text is provided.
 */
function computeLocalPenalty(filingType, daysLate, daysUntilDue, penaltySeverity) {
  // Known penalty rates by filing type (from Indian statutes)
  const RATES = {
    'GSTR-3B': { daily: 50, max: 5000, escalationDays: 90, escalation: 'Show cause notice + 18% interest compounding', statute: 'CGST Act Sec 47' },
    'GSTR-1': { daily: 50, max: 5000, escalationDays: 90, escalation: 'Show cause notice + assessment proceedings', statute: 'CGST Act Sec 47' },
    'Form 26Q': { daily: 200, max: null, escalationDays: 365, escalation: 'Prosecution under Sec 276B (up to 7 years)', statute: 'Income Tax Act Sec 234E' },
    'Form 24Q': { daily: 200, max: null, escalationDays: 365, escalation: 'Prosecution under Sec 276B', statute: 'Income Tax Act Sec 234E' },
    'DIR-3 KYC': { daily: 0, fixed: 5000, max: 5000, escalationDays: 30, escalation: 'DIN deactivation + ₹5,000 penalty', statute: 'Companies Rules 2014, Rule 12A' },
    'Form AOC-4': { daily: 100, max: null, escalationDays: 270, escalation: 'Prosecution of directors + company strike-off risk', statute: 'Companies Act Sec 137' },
    'Form MGT-7': { daily: 100, max: null, escalationDays: 270, escalation: 'Prosecution of directors + company strike-off risk', statute: 'Companies Act Sec 92' },
    'ITR-6': { daily: 0, fixed: 10000, max: 10000, escalationDays: 365, escalation: 'Assessment proceedings + prosecution', statute: 'Income Tax Act Sec 234F' },
    'EPF ECR': { daily: 0, interest: 12, damages: 100, max: null, escalationDays: 60, escalation: '12% interest + damages up to 100% + prosecution', statute: 'EPF Act Para 14B' },
    'Form MSME-1': { daily: 0, fixed: 25000, max: 25000, escalationDays: 180, escalation: 'Penalty on officers in default', statute: 'MSMED Act Sec 9' },
    'Form ADT-1': { daily: 100, max: null, escalationDays: 270, escalation: 'Deemed vacation of auditor office', statute: 'Companies Act Sec 139' },
    'AGM': { daily: 5000, max: 1000000, escalationDays: 90, escalation: 'Prosecution of directors + ₹1,00,000 company penalty', statute: 'Companies Act Sec 96-99' },
    'Advance Tax': { daily: 0, interestMonthly: 1, max: null, escalationDays: 365, escalation: 'Interest compounding under Sec 234B & 234C', statute: 'Income Tax Act Sec 234B/C' },
  };

  // Find matching rate (partial match on filing type)
  let rate = null;
  let matchedKey = filingType;
  for (const [key, value] of Object.entries(RATES)) {
    if (filingType && (filingType.includes(key) || key.includes(filingType) || filingType.toLowerCase().includes(key.toLowerCase()))) {
      rate = value;
      matchedKey = key;
      break;
    }
  }

  // Default fallback if filing type not recognized
  if (!rate) {
    const estimatedDaily = (penaltySeverity || 3) * 50;
    rate = {
      daily: estimatedDaily,
      max: null,
      escalationDays: 180,
      escalation: 'Regulatory action and potential prosecution',
      statute: 'Various applicable statutes'
    };
  }

  // Compute penalty
  let totalAccrued = 0;
  let dailyRate = rate.daily || 0;

  if (daysLate > 0) {
    if (rate.fixed) {
      totalAccrued = rate.fixed;
    } else if (rate.daily) {
      totalAccrued = rate.daily * daysLate;
    } else if (rate.interestMonthly) {
      // Monthly interest calculation (simplified)
      const monthsLate = Math.ceil(daysLate / 30);
      totalAccrued = monthsLate * rate.interestMonthly; // percentage — caller needs context
      dailyRate = 0;
    }

    // Apply cap
    if (rate.max && totalAccrued > rate.max) {
      totalAccrued = rate.max;
    }
  }

  const daysUntilEscalation = Math.max(0, rate.escalationDays - daysLate);

  // Determine severity level
  let severityLevel = 'warning';
  if (daysLate > 0 && daysUntilEscalation <= 30) severityLevel = 'critical';
  if (daysLate > 0 && daysUntilEscalation === 0) severityLevel = 'prosecution_risk';
  if (daysLate === 0 && daysUntilDue <= 7) severityLevel = 'warning';
  if (daysLate === 0 && daysUntilDue > 7) severityLevel = 'safe';

  // Build plain English summary
  let plainEnglish = '';
  if (daysLate === 0) {
    plainEnglish = `Due in ${Math.abs(daysUntilDue)} days. If missed: ${dailyRate > 0 ? `₹${dailyRate.toLocaleString('en-IN')}/day penalty` : `₹${(rate.fixed || 0).toLocaleString('en-IN')} fixed penalty`}.`;
  } else {
    const parts = [];
    if (dailyRate > 0) parts.push(`₹${dailyRate.toLocaleString('en-IN')}/day late fee`);
    parts.push(`₹${totalAccrued.toLocaleString('en-IN')} accrued`);
    if (daysUntilEscalation > 0) {
      parts.push(`escalates to ${rate.escalation.split('+')[0].trim().toLowerCase()} in ${daysUntilEscalation} days`);
    } else {
      parts.push(`${rate.escalation.split('+')[0].trim().toLowerCase()} risk is active`);
    }
    plainEnglish = parts.join(', ');
  }

  return {
    dailyPenaltyRate: dailyRate,
    totalAccrued,
    daysLate,
    daysUntilDue,
    nextEscalationDays: daysUntilEscalation,
    escalationType: rate.escalation,
    plainEnglishSummary: plainEnglish,
    severityLevel,
    maxCap: rate.max,
    additionalCharges: rate.interest ? `${rate.interest}% p.a. interest on outstanding amount` : (rate.damages ? `Up to ${rate.damages}% damages on employer contribution` : null),
    statute: rate.statute,
    filingType: matchedKey,
  };
}
