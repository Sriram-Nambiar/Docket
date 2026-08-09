import { NextResponse } from 'next/server';
import { getLocalQueryResponse } from '../../../lib/localAnalysis';

export async function POST(req) {
  let prompt = '';
  try {
    ({ prompt } = await req.json());
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.NVIDIA_API_KEY;
    const baseUrl = process.env.NIM_BASE_URL || 'https://integrate.api.nvidia.com/v1';
    const model = process.env.NIM_MODEL || 'meta/llama-3.1-70b-instruct';

    if (!apiKey) {
      return NextResponse.json({
        success: true,
        model: 'local-fallback',
        result: getLocalQueryResponse(prompt),
        aiGenerated: false,
        source: 'local_fallback',
        disclaimer: 'Local workspace guidance only. Review with a qualified compliance/legal SME before use in regulatory decisions.',
        timestamp: new Date().toISOString(),
      });
    }

    const systemPrompt = `You are an AI Compliance & Regulatory Intelligence Assistant specialized in Indian statutory law (Ministry of Corporate Affairs / Companies Act 2013, CBIC CGST Act 2017, Income Tax Act 1961, EPFO, and DPDP Act).
Your task is to provide accurate, grounded compliance guidance for a Private Limited Company named "Apex Technologies Pvt Ltd".
CRITICAL: Every answer MUST trace back to a dated statutory section (e.g. Companies Act 2013 Sec 137 for AOC-4, CGST Act 2017 Sec 39 for GSTR-3B, Income Tax Act Sec 200(3) for Form 26Q).
IMPORTANT: You are an AI assistant. Your outputs are AI-generated and must be reviewed by a qualified compliance/legal SME before being relied upon for regulatory decisions.
Be concise, authoritative, and structured.`;

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      signal: AbortSignal.timeout(8000),
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({
        success: true,
        model: 'local-fallback',
        result: getLocalQueryResponse(prompt),
        aiGenerated: false,
        source: 'local_fallback',
        providerError: `The AI provider returned ${response.status}; local workspace guidance returned instead.`,
        disclaimer: 'Local workspace guidance only. Review with a qualified compliance/legal SME before use in regulatory decisions.',
        timestamp: new Date().toISOString(),
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No response generated";

    return NextResponse.json({
      success: true,
      model: model,
      result: reply,
      aiGenerated: true,
      smeVerified: false,
      disclaimer: 'AI-generated output. Must be reviewed by a qualified compliance/legal SME before use in regulatory decisions.',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    if (!prompt) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({
      success: true,
      model: 'local-fallback',
      result: getLocalQueryResponse(prompt),
      aiGenerated: false,
      source: 'local_fallback',
      providerError: 'The AI provider was unavailable; local workspace guidance returned instead.',
      disclaimer: 'Local workspace guidance only. Review with a qualified compliance/legal SME before use in regulatory decisions.',
      timestamp: new Date().toISOString(),
    });
  }
}
