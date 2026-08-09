import { NextResponse } from 'next/server';
import { getLocalExtraction } from '../../../lib/localAnalysis';

export async function POST(request) {
  let text = '';
  let fileName = '';
  try {
    ({ text, fileName } = await request.json());

    if (!text) {
      return NextResponse.json({ success: false, error: 'No text provided' }, { status: 400 });
    }

    if (!process.env.NVIDIA_API_KEY) {
      return NextResponse.json({
        success: true,
        extraction: getLocalExtraction({ text, fileName }),
        aiGenerated: false,
        source: 'local_fallback',
        timestamp: new Date().toISOString(),
      });
    }

    const systemPrompt = `You are a Document Intelligence Agent for Indian regulatory compliance.
Given the text content extracted from a business/legal document, identify:
1. Document type (e.g., Certificate of Incorporation, GST Registration, Tax Return, Board Resolution, etc.)
2. Key entities (company name, CIN, GSTIN, directors, dates)
3. Regulatory rules this document satisfies or relates to
4. Any compliance gaps or missing information

Output valid JSON with keys: documentType (string), entities (object), matchedRules (array of {ruleId, ruleName, status}), gaps (array of strings), confidence (string percentage).`;

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      signal: AbortSignal.timeout(8000),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-70b-instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Document Name: ${fileName}\n\nDocument Content:\n${text}` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NVIDIA API Error:', errorText);
      throw new Error('Failed to extract document data from LLM');
    }

    const data = await response.json();
    let extraction = {};
    try {
      extraction = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      console.error('Failed to parse JSON', e);
      extraction = { error: 'Failed to parse JSON response' };
    }

    // FIRE ASYNC NOTIFICATION FANOUT via REDIS
    try {
      const { processNotificationFanout } = await import('../../../lib/notificationFanout');
      
      const gapCount = Array.isArray(extraction.gaps) ? extraction.gaps.length : 0;
      const urgency = gapCount > 0 ? 'Urgent' : 'Normal';
      
      const eventPayload = {
        type: 'DOCUMENT_ANALYZED',
        id: `doc-${Date.now()}`,
        timestamp: new Date().toISOString(),
        payload: {
          fileName: fileName,
          documentType: extraction.documentType || 'Unknown Document',
          gapCount: gapCount,
          urgency: urgency,
          message: `Your document analysis is complete. ${gapCount} compliance gaps found.`
        }
      };
      
      // Dispatch without awaiting to prevent blocking the HTTP response
      // In a real next.js deployment, this might need waitUntil() for Edge or a separate worker.
      // For standard Node.js runtime in Next, it runs in the background.
      processNotificationFanout(eventPayload).catch(err => {
        console.error('Redis Fanout Error in /api/extract:', err);
      });
      
    } catch (importErr) {
      console.error('Could not trigger notification fanout:', importErr);
    }

    return NextResponse.json({
      success: true,
      extraction,
      aiGenerated: true,
      smeVerified: false,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Extraction Error:', error);
    if (!text) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({
      success: true,
      extraction: getLocalExtraction({ text, fileName }),
      aiGenerated: false,
      source: 'local_fallback',
      providerError: 'The AI provider was unavailable; limited local analysis returned instead.',
      timestamp: new Date().toISOString(),
    });
  }
}
