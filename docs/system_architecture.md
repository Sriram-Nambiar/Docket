# System Architecture

The following diagram illustrates the overarching system architecture for the Docket platform, detailing the interactions between the frontend client, state management, API routes, and external infrastructure.

```mermaid
flowchart TD
    subgraph Client ["Frontend (Next.js 16 App Router)"]
        UI["Regulatory Ledger UI<br/>(Tailwind v4, Fraunces / IBM Plex)"]
        Sidebar["Sidebar Navigation<br/>(RBAC Tier Indicator)"]
        Intake["Tier 1: Founder Intake"]
        Dash["Tier 2: Compliance Dashboard"]
        Checklist["Checklist Engine Workbook<br/>(4 Honest Statuses)"]
        PenaltyUI["Penalty Calculator Panel<br/>(NVIDIA NIM UI)"]
        WhatsAppUI["WhatsApp Gateway Settings"]
    end

    subgraph State ["Client State & Pub/Sub"]
        TaskStore["taskStore.js<br/>(useSyncExternalStore)"]
        AuthCtx["AuthContext.js<br/>(Role & Session)"]
    end

    subgraph API ["Next.js App Router API Routes"]
        APIPenalty["/api/penalty<br/>(NIM Statute Parser)"]
        APIIntake["/api/intake<br/>(Structure Evaluator)"]
        APIExtract["/api/extract<br/>(VLM OCR Matcher)"]
        APINotif["/api/notifications<br/>(Redis Fan-Out)"]
    end

    subgraph External ["External Infrastructure & AI Services"]
        NVIDIA["NVIDIA NIM Cloud<br/>(meta/llama-3.1-70b-instruct)"]
        Redis["Redis Event Queue<br/>(redis://127.0.0.1:6379)"]
        WA["WhatsApp Business API<br/>(Twilio / Meta Webhook)"]
    end

    UI --> TaskStore
    UI --> AuthCtx
    PenaltyUI --> APIPenalty
    Intake --> APIIntake
    Intake --> APIExtract
    WhatsAppUI --> APINotif

    APIPenalty -->|JSON Completion| NVIDIA
    APIIntake -->|JSON Completion| NVIDIA
    APINotif -->|Event Publish| Redis
    APINotif -->|Webhook Trigger| WA
    TaskStore -->|Append Log| Dash
```
