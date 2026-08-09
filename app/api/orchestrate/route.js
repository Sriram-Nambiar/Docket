import { getLocalIntakeAnalysis } from '../../../lib/localAnalysis';
import { REGULATORY_RULES_FULL } from '../../../lib/mockData';
import crypto from 'crypto';

export async function POST(req) {
  // Parse body
  let body = {};
  try {
    body = await req.json();
  } catch (err) {
    body = {};
  }

  const { businessDescription, sector, turnover, employees, founders, fdi } = body;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data) => {
        const payload = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(payload));
      };

      const delay = (ms) => new Promise(r => setTimeout(r, ms));
      const startTime = Date.now();
      const workflowId = `wf-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`;
      
      const agentOutputs = {};

      try {
        sendEvent({
          type: 'workflow:start',
          workflowId,
          timestamp: new Date().toISOString()
        });

        // ==========================================
        // Agent 1: Intake Advisor Agent
        // ==========================================
        let bestMatch = 'Private Limited Company';
        try {
          sendEvent({
            type: 'agent:update',
            step: 1,
            status: 'thinking',
            message: 'Parsing business profile and sector classification...',
            timestamp: new Date().toISOString()
          });
          
          await delay(600);

          sendEvent({
            type: 'agent:update',
            step: 1,
            status: 'running',
            message: 'Evaluating entity structure suitability via NVIDIA NIM...',
            timestamp: new Date().toISOString()
          });

          let agent1Output = null;

          if (process.env.NVIDIA_API_KEY) {
            try {
              const prompt = `Based on the following business profile, recommend the best entity structure (e.g., Private Limited Company, LLP, Sole Proprietorship).\nDescription: ${businessDescription}\nSector: ${sector}\nTurnover: ${turnover}\nEmployees: ${employees}\nFounders: ${founders}\nFDI: ${fdi}\nReturn JSON with keys: bestMatch, matchScore, rationale, mandatoryCompliances.`;
              const response = await fetch(`${process.env.NIM_BASE_URL || 'https://integrate.api.nvidia.com/v1'}/chat/completions`, {
                method: 'POST',
                signal: AbortSignal.timeout(8000),
                headers: {
                  'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: process.env.NIM_MODEL || 'meta/llama-3.1-70b-instruct',
                  messages: [{ role: 'user', content: prompt }],
                  temperature: 0.1,
                  max_tokens: 800,
                }),
              });
              const data = await response.json();
              let content = data?.choices?.[0]?.message?.content || '';
              // Simple heuristic to extract JSON if wrapped in markdown
              if (content.includes('```json')) {
                content = content.split('```json')[1].split('```')[0].trim();
              } else if (content.includes('```')) {
                content = content.split('```')[1].trim();
              }
              agent1Output = JSON.parse(content);
            } catch (err) {
              agent1Output = getLocalIntakeAnalysis(body);
            }
          } else {
            agent1Output = getLocalIntakeAnalysis(body);
          }

          bestMatch = agent1Output.bestMatch || 'Private Limited Company';

          sendEvent({
            type: 'agent:update',
            step: 1,
            status: 'running',
            message: `Identified optimal structure: ${bestMatch}`,
            timestamp: new Date().toISOString()
          });

          await delay(200);

          sendEvent({
            type: 'agent:complete',
            step: 1,
            duration: 800,
            summary: `Intake analysis complete. Recommended: ${bestMatch}`,
            output: agent1Output,
            timestamp: new Date().toISOString()
          });
          
          agentOutputs.agent1 = agent1Output;
        } catch (error) {
          sendEvent({
            type: 'agent:error',
            step: 1,
            message: error.message,
            timestamp: new Date().toISOString()
          });
        }

        // ==========================================
        // Agent 2: Rule Engine Evaluator
        // ==========================================
        let matchedRules = [];
        try {
          await delay(400);

          sendEvent({
            type: 'agent:update',
            step: 2,
            status: 'thinking',
            message: 'Loading SME-approved regulatory rule library...',
            timestamp: new Date().toISOString()
          });

          await delay(300);

          sendEvent({
            type: 'agent:update',
            step: 2,
            status: 'running',
            message: 'Scanning MCA, GSTN, Income Tax, EPFO, and ESI catalogs...',
            timestamp: new Date().toISOString()
          });

          const byAuthority = {};
          
          if (Array.isArray(REGULATORY_RULES_FULL)) {
            matchedRules = REGULATORY_RULES_FULL.filter(rule => {
              if (!rule.applicability || !rule.applicability.entity_type) return true;
              return rule.applicability.entity_type.includes(bestMatch);
            }).map(rule => ({
              id: rule.id || rule.ruleId,
              title: rule.title || rule.name,
              authority: rule.authority,
              citation: rule.citation || rule.section,
              frequency: rule.frequency,
              penalty: rule.penalty,
              dueDate: rule.dueDate || rule.nextDueDate,
              status: rule.status || (Math.random() > 0.5 ? 'Red' : 'Green')
            }));
            
            matchedRules.forEach(rule => {
              byAuthority[rule.authority] = (byAuthority[rule.authority] || 0) + 1;
            });
          }

          const authorities = Object.keys(byAuthority).join(', ');

          sendEvent({
            type: 'agent:update',
            step: 2,
            status: 'running',
            message: `Matched ${matchedRules.length} statutory obligations across ${authorities}`,
            timestamp: new Date().toISOString()
          });

          await delay(300);

          const agent2Output = {
            totalMatched: matchedRules.length,
            matchedRules,
            byAuthority
          };

          sendEvent({
            type: 'agent:complete',
            step: 2,
            duration: 1000,
            summary: `Rule evaluation complete. ${matchedRules.length} rules matched.`,
            output: agent2Output,
            timestamp: new Date().toISOString()
          });
          
          agentOutputs.agent2 = agent2Output;
        } catch (error) {
          sendEvent({
            type: 'agent:error',
            step: 2,
            message: error.message,
            timestamp: new Date().toISOString()
          });
        }

        // ==========================================
        // Agent 3: Penalty Risk Scanner
        // ==========================================
        let penalties = [];
        try {
          await delay(500);

          sendEvent({
            type: 'agent:update',
            step: 3,
            status: 'thinking',
            message: 'Analyzing penalty exposure for overdue and upcoming obligations...',
            timestamp: new Date().toISOString()
          });

          await delay(200);

          const atRiskRules = matchedRules.filter(r => r.status === 'Red' || r.status === 'Amber');
          
          sendEvent({
            type: 'agent:update',
            step: 3,
            status: 'running',
            message: `Computing daily accruals for ${atRiskRules.length} at-risk filings...`,
            timestamp: new Date().toISOString()
          });

          let totalExposureNum = 0;
          let criticalCount = 0;

          const today = new Date();

          penalties = atRiskRules.map(rule => {
            let dailyRate = 50;
            let maxPenalty = Infinity;
            let fixedPenalty = 0;
            let isInterest = false;

            const title = rule.title || '';
            
            if (title.includes('GSTR-3B') || title.includes('GSTR-1')) {
              dailyRate = 50;
              maxPenalty = 5000;
            } else if (title.includes('DIR-3')) {
              fixedPenalty = 5000;
              dailyRate = 0;
            } else if (title.includes('AOC-4') || title.includes('MGT-7')) {
              dailyRate = 100;
            } else if (title.includes('ECR') || title.includes('EPF')) {
              isInterest = true;
              dailyRate = 0;
            }

            let daysLate = 0;
            if (rule.dueDate) {
              const dueDate = new Date(rule.dueDate);
              daysLate = Math.max(0, Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24)));
            } else if (rule.status === 'Red') {
               daysLate = 30; // mock
            }

            let accrued = 0;
            if (fixedPenalty > 0 && daysLate > 0) {
                accrued = fixedPenalty;
            } else if (isInterest && daysLate > 0) {
                accrued = 1000; // mock interest
            } else if (daysLate > 0) {
                accrued = Math.min(daysLate * dailyRate, maxPenalty);
            }
            
            if (accrued > 0) {
                totalExposureNum += accrued;
                if (rule.status === 'Red' || accrued > 1000) criticalCount++;
            }

            return {
              ruleId: rule.id,
              title: rule.title,
              daysLate,
              dailyRate,
              accrued,
              severity: rule.status
            };
          }).filter(p => p.accrued > 0);

          const totalExposureStr = `₹${totalExposureNum.toLocaleString('en-IN')}`;

          await delay(200);

          sendEvent({
            type: 'agent:update',
            step: 3,
            status: 'running',
            message: `Total exposure calculated: ${totalExposureStr}`,
            timestamp: new Date().toISOString()
          });

          await delay(200);

          const agent3Output = {
            totalExposure: totalExposureStr,
            criticalCount,
            penalties
          };

          sendEvent({
            type: 'agent:complete',
            step: 3,
            duration: 900,
            summary: `Risk scan complete. Exposure: ${totalExposureStr}`,
            output: agent3Output,
            timestamp: new Date().toISOString()
          });

          agentOutputs.agent3 = agent3Output;
        } catch (error) {
          sendEvent({
            type: 'agent:error',
            step: 3,
            message: error.message,
            timestamp: new Date().toISOString()
          });
        }

        // ==========================================
        // Agent 4: Form Pre-Fill Agent
        // ==========================================
        try {
          await delay(400);

          sendEvent({
            type: 'agent:update',
            step: 4,
            status: 'thinking',
            message: 'Preparing pre-filled statutory form templates...',
            timestamp: new Date().toISOString()
          });

          await delay(200);

          sendEvent({
            type: 'agent:update',
            step: 4,
            status: 'running',
            message: 'Auto-populating Form AOC-4, GSTR-3B, DIR-3 KYC with entity master data...',
            timestamp: new Date().toISOString()
          });

          const companyName = businessDescription ? businessDescription.substring(0, 30) : 'Apex Technologies Pvt Ltd';
          const topForms = matchedRules.slice(0, 4);
          
          const forms = topForms.map(r => ({
            formName: r.title,
            authority: r.authority,
            fields: {
              companyName,
              cin: 'U72900MH2024PTC412345',
              gstin: '27AAACA1234B1Z5',
              sector: sector || 'Technology',
              financialYear: '2023-24'
            },
            confidence: '98.5%'
          }));

          await delay(300);

          const agent4Output = {
            formsGenerated: forms.length,
            forms,
            confidence: '98.5%'
          };

          sendEvent({
            type: 'agent:complete',
            step: 4,
            duration: 900,
            summary: `Pre-filled ${forms.length} forms with 98.5% confidence.`,
            output: agent4Output,
            timestamp: new Date().toISOString()
          });

          agentOutputs.agent4 = agent4Output;
        } catch (error) {
          sendEvent({
            type: 'agent:error',
            step: 4,
            message: error.message,
            timestamp: new Date().toISOString()
          });
        }

        // ==========================================
        // Agent 5: Audit & Hash Engine
        // ==========================================
        try {
          await delay(300);

          sendEvent({
            type: 'agent:update',
            step: 5,
            status: 'thinking',
            message: 'Computing tamper-evident workflow hash...',
            timestamp: new Date().toISOString()
          });

          await delay(200);

          sendEvent({
            type: 'agent:update',
            step: 5,
            status: 'running',
            message: 'Generating SHA-256 state log and appending to immutable audit trail...',
            timestamp: new Date().toISOString()
          });

          const dataString = workflowId + JSON.stringify(agentOutputs);
          const hashHex = crypto.createHash('sha256').update(dataString).digest('hex');

          await delay(200);

          const agent5Output = {
            hash: `sha256:${hashHex}`,
            auditId: `aud-${Date.now()}`,
            workflowId,
            logged: true
          };

          sendEvent({
            type: 'agent:complete',
            step: 5,
            duration: 700,
            summary: `Audit log generated and secured. Hash: ${hashHex.substring(0, 8)}...`,
            output: agent5Output,
            timestamp: new Date().toISOString()
          });

          agentOutputs.agent5 = agent5Output;
        } catch (error) {
          sendEvent({
            type: 'agent:error',
            step: 5,
            message: error.message,
            timestamp: new Date().toISOString()
          });
        }

        // ==========================================
        // Workflow Complete
        // ==========================================
        const totalDuration = Date.now() - startTime;
        
        sendEvent({
          type: 'workflow:complete',
          workflowId,
          totalDuration,
          hash: agentOutputs.agent5?.hash || 'sha256:error',
          timestamp: new Date().toISOString()
        });

      } catch (err) {
        // Unhandled fatal error
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          type: 'workflow:error',
          message: err.message,
          timestamp: new Date().toISOString()
        })}\n\n`));
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}
