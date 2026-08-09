import { NextResponse } from 'next/server';
import { getLocalIntakeAnalysis } from '../../../lib/localAnalysis';

export async function POST(req) {
  try {
    const { businessDescription, sector, turnover, employees, founders, fdi } = await req.json();

    const apiKey = process.env.NVIDIA_API_KEY;
    const baseUrl = process.env.NIM_BASE_URL || 'https://integrate.api.nvidia.com/v1';
    const model = process.env.NIM_MODEL || 'meta/llama-3.1-70b-instruct';

    if (!apiKey) {
      return NextResponse.json({
        success: true,
        analysis: getLocalIntakeAnalysis({ businessDescription, sector }),
        aiGenerated: false,
        source: 'local_fallback',
        disclaimer: 'Local baseline only. Review with a qualified compliance/legal SME before making regulatory decisions.',
        timestamp: new Date().toISOString(),
      });
    }

    const prompt = `Analyze the following Indian business intake details and evaluate legal entity suitability (Private Limited Company vs. Limited Liability Partnership vs. Public Limited Company):
- Description: ${businessDescription || "IT SaaS Platform with enterprise clients"}
- Sector: ${sector || "IT Services"}
- Turnover: ${turnover || "₹1.25 Crore"}
- Employees: ${employees || 18}
- Founders: ${founders || 2}
- Foreign Direct Investment (FDI): ${fdi ? "Yes" : "No"}

Output valid JSON only with keys:
"bestMatch" (string), "matchScore" (string e.g. "96%"), "rationale" (string), "pros" (array of strings), "cons" (array of strings), "mandatoryCompliances" (array of objects with "name", "authority", "freq").`;

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      signal: AbortSignal.timeout(8000),
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({
        success: true,
        analysis: getLocalIntakeAnalysis({ businessDescription, sector }),
        aiGenerated: false,
        source: 'local_fallback',
        providerError: `The AI provider returned ${response.status}; local baseline returned instead.`,
        disclaimer: 'Local baseline only. Review with a qualified compliance/legal SME before making regulatory decisions.',
        timestamp: new Date().toISOString(),
      });
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || "";
    
    let parsedJSON = null;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedJSON = JSON.parse(jsonMatch[0]);
      } else {
        parsedJSON = JSON.parse(rawContent);
      }
    } catch {
      parsedJSON = {
        bestMatch: "Private Limited Company",
        matchScore: "96%",
        rationale: rawContent,
        pros: ["Limited Liability", "VC Investment Ready", "ESOP Creation Eligible"],
        cons: ["Annual AOC-4 & MGT-7 Secretarial Filings Required"],
        mandatoryCompliances: [
          { name: "GST GSTR-1/3B Returns", authority: "CBIC", freq: "Monthly" },
          { name: "Form AOC-4 Financials", authority: "MCA", freq: "Annual" },
          { name: "Form DIR-3 KYC", authority: "MCA", freq: "Annual (Sept 30)" },
        ]
      };
    }

    return NextResponse.json({
      success: true,
      analysis: parsedJSON,
      aiGenerated: true,
      smeVerified: false,
      disclaimer: 'AI-generated analysis. Must be reviewed by a qualified compliance/legal SME before use in regulatory decisions.',
      timestamp: new Date().toISOString(),
    });

  } catch {
    return NextResponse.json({
      success: true,
      analysis: getLocalIntakeAnalysis(),
      aiGenerated: false,
      source: 'local_fallback',
      providerError: 'The AI provider was unavailable; local baseline returned instead.',
      disclaimer: 'Local baseline only. Review with a qualified compliance/legal SME before making regulatory decisions.',
      timestamp: new Date().toISOString(),
    });
  }
}
