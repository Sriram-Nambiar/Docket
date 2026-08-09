# 🏗️ Docket — System Architecture & Block Diagrams

This document presents the visual system architecture, block diagrams, data flow lifecycles, and component dependency structures for **Docket**—the AI-powered enterprise regulatory & compliance automation platform.

---

## 📑 Diagrams Included

1. [High-Level Functional Block Diagram](#1-high-level-functional-block-diagram)
2. [Full System Architecture Diagram](#2-full-system-architecture-diagram)
3. [Data Flow & Execution Lifecycle Diagram](#3-data-flow--execution-lifecycle-diagram)
4. [Component & State Store Dependency Map](#4-component--state-store-dependency-map)
5. [Role-Based Access Control (RBAC) Flow Diagram](#5-role-based-access-control-rbac-flow-diagram)

---

## 1. High-Level Functional Block Diagram

This block diagram represents the primary functional modules of Docket and how user interactions flow through the application logic to external services.

```mermaid
flowchart LR
    subgraph ClientLayer ["1. User Interface & Experience"]
        A1["Tier 1: Solo Founder Intake"]
        A2["Tier 2: Compliance Command Center"]
        A3["Checklist Engine Workbook"]
        A4["WhatsApp Reminder Gateway"]
    end

    subgraph LogicLayer ["2. Application API & Logic"]
        B1["RBAC & Auth Context"]
        B2["NIM Penalty Calculation Engine"]
        B3["VLM Document OCR Parser"]
        B4["Event Notification Fanout Engine"]
    end

    subgraph InfraLayer ["3. External AI & Event Infrastructure"]
        C1["NVIDIA NIM Cloud (Llama 3.1 70B)"]
        C2["Redis Event Queue & Pub/Sub"]
        C3["WhatsApp Gateway / Webhook"]
    end

    ClientLayer -->|"User Action / API Calls"| LogicLayer
    LogicLayer -->|"AI Inference Prompts"| C1
    LogicLayer -->|"Pub/Sub Notifications"| C2
    LogicLayer -->|"Dispatch Alerts"| C3
```

---

## 2. Full System Architecture Diagram

This detailed architectural diagram details the interactions between the Next.js 16 Client, `useSyncExternalStore` state, App Router Server Routes, and backend services.

```mermaid
flowchart TD
    subgraph Frontend ["Frontend (Next.js 16 App Router)"]
        UI["Regulatory Ledger Shell (page.jsx)"]
        Sidebar["Sidebar Navigation & Tier Indicator"]
        Workbook["Checklist Engine Workbook (4 Statuses)"]
        PenaltyUI["Penalty Calculator Panel"]
        WA_UI["WhatsApp Reminder Settings"]
        VLM_UI["VLM OCR Pipeline Component"]
    end

    subgraph StateStore ["Client State & Reactive Stores"]
        TaskStore["taskStore.js (Pub/Sub Event Store)"]
        AuthCtx["AuthContext.js (Role & Session State)"]
    end

    subgraph APIRoutes ["Next.js App Router API Routes"]
        APIPenalty["/api/penalty (NIM Statute Engine)"]
        APIIntake["/api/intake (NLP Dossier Parser)"]
        APIExtract["/api/extract (VLM Receipt Matcher)"]
        APINotif["/api/notifications (Redis Queue & Fanout)"]
        APITasks["/api/tasks (Task CRUD Endpoint)"]
    end

    subgraph ExternalServices ["External Infrastructure & AI Services"]
        NVIDIA["NVIDIA NIM AI API (meta/llama-3.1-70b-instruct)"]
        Redis["Redis Event Queue & History (localhost:6379)"]
        WA_Gate["WhatsApp Gateway (Twilio / Meta API)"]
    end

    UI --> TaskStore
    UI --> AuthCtx
    Workbook --> APITasks
    PenaltyUI --> APIPenalty
    WA_UI --> APINotif
    VLM_UI --> APIExtract

    APIPenalty -->|"JSON Completion"| NVIDIA
    APIIntake -->|"Prompt Evaluation"| NVIDIA
    APIExtract -->|"Text Entity Extraction"| NVIDIA
    APINotif -->|"LPUSH & PUBLISH"| Redis
    APINotif -->|"Webhook Trigger"| WA_Gate
    TaskStore -->|"Append Audit Entry"| UI
```

---

## 3. Data Flow & Execution Lifecycle Diagram

This diagram illustrates how data flows from user input (document uploads, natural language prompts) down to automated status verification and notification delivery.

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Founder / Compliance Chief)
    participant UI as React UI Component
    participant Store as taskStore (Local State)
    participant API as Next.js API Route
    participant AI as NVIDIA NIM AI Engine
    participant Redis as Redis Queue / Event Bus
    participant WA as WhatsApp Gateway

    rect rgb(240, 248, 255)
    note over User, AI: Scenario 1: Document Upload & VLM Verification
    User->>UI: Uploads Payment Receipt / Challan PDF
    UI->>API: POST /api/extract (FormData)
    API->>AI: Extracts ARN, Filing Date, Amount
    AI-->>API: Returns Structured JSON Payload
    API-->>UI: Returns Extracted Metadata
    UI->>Store: Auto-transitions Status -> "Filed & Verified"
    end

    rect rgb(254, 243, 199)
    note over User, WA: Scenario 2: Automated Notification Fan-out
    Store->>API: POST /api/notifications (Task Overdue / Digest Trigger)
    API->>Redis: LPUSH to compliance:notifications:queue
    API->>Redis: PUBLISH to compliance:notifications:pubsub
    API->>WA: Dispatches WhatsApp Alert Template
    WA-->>User: Delivers WhatsApp Message to Founder Phone
    end
```

---

## 4. Component & State Store Dependency Map

Map showing how individual React UI components communicate through `lib/taskStore.js` and `lib/AuthContext.js`.

```mermaid
graph TD
    App["app/page.jsx (Application Shell)"]

    subgraph AuthLayer ["Authentication & State Context"]
        AuthCtx["lib/AuthContext.js"]
        TaskStore["lib/taskStore.js"]
    end

    subgraph Navigation ["Layout Components"]
        HeaderNav["components/HeaderNav.jsx"]
        Sidebar["components/Sidebar.jsx"]
    end

    subgraph Views ["Main Feature Views"]
        IntakeView["components/SoloFounderIntake.jsx"]
        DashView["components/ComplianceHeadDashboard.jsx"]
        WorkbookView["components/ChecklistEngineWorkbook.jsx"]
        PenaltyView["components/PenaltyCalculatorPanel.jsx"]
        WhatsAppView["components/WhatsAppReminderSettings.jsx"]
        VLMView["components/VlmOcrPipeline.jsx"]
        GraphView["components/KnowledgeGraphView.jsx"]
    end

    App --> AuthCtx
    App --> TaskStore
    App --> HeaderNav
    App --> Sidebar

    HeaderNav --> AuthCtx
    Sidebar --> AuthCtx

    App --> IntakeView
    App --> DashView
    App --> WorkbookView
    App --> PenaltyView
    App --> WhatsAppView
    App --> VLMView
    App --> GraphView

    IntakeView --> TaskStore
    WorkbookView --> TaskStore
    DashView --> TaskStore
    WhatsAppView --> TaskStore
```

---

## 5. Role-Based Access Control (RBAC) Flow Diagram

Shows permission routing between Tier 1 (Solo Founder) and Tier 2 (Compliance Chief) personas.

```mermaid
flowchart TD
    Start((User Enters Platform)) --> SessionCheck{Check AuthContext}

    SessionCheck -->|"Tier 1: Solo Founder"| Tier1Mode["Solo Founder Mode"]
    SessionCheck -->|"Tier 2: Compliance Head"| Tier2Mode["Compliance Head Mode"]

    subgraph Tier1Capabilities ["Tier 1 Permitted Features"]
        T1_1["Conversational Natural Language Intake"]
        T1_2["Simplified Task Checklist"]
        T1_3["Basic WhatsApp Settings"]
        T1_4["Document Proof Upload"]
    end

    subgraph Tier2Capabilities ["Tier 2 Permitted Features"]
        T2_1["Executive Command Center & Risk Gauges"]
        T2_2["Full Statutory Workbook & Spreadsheet Bulk Actions"]
        T2_3["Interactive Legal Knowledge Graph"]
        T2_4["NVIDIA NIM Penalty Calculator & Formula Overrides"]
        T2_5["Immutable Audit Trail Export & Cryptographic Hashes"]
    end

    Tier1Mode --> Tier1Capabilities
    Tier2Mode --> Tier2Capabilities
```

---

*Architectural Documentation generated for Docket AI Compliance Platform.*
