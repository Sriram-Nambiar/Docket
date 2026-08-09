# Docket Data Flow Architecture

Below is the complete Data Flow Diagram for the Docket platform. 

> [!NOTE]
> Modules marked with dashed lines (`-.-`) or labeled **[FUTURE UPGRADE]** indicate components that are architected but require backend infrastructure (Databases, Message Queues, Gov API access) to fully realize beyond the current frontend demo.

```mermaid
flowchart TD
    %% Users
    U1((Tier 1: Founder)):::user
    U2((Tier 2: Compliance Head)):::user

    %% Frontend App (Client)
    subgraph Frontend [Next.js Client Application]
        Auth[AuthContext & RBAC]
        IntakeUI[Solo Founder Intake Form]
        DashUI[Compliance Dashboard]
        TaskUI[Visual Task Canvas]
        TimelineUI[Orchestration Timeline]
        GraphUI[Knowledge Graph View]
    end

    %% Internal Next.js API Routes (Serverless)
    subgraph APILayer [Next.js Route Handlers]
        AuthAPI[/api/auth/]
        IntakeAPI[/api/intake/]
        ExtractAPI[/api/extract/]
        QueryAPI[/api/query/]
        NotifAPI[/api/notifications/]
    end

    %% External Services (Current)
    subgraph External [External AI Providers]
        NVIDIA[NVIDIA NIM LLM API\nmeta/llama-3.1-70b]:::ai
        VLM[Vision-Language Model\nOCR Engine]:::ai
    end

    %% Future Upgrades (Backend Infrastructure)
    subgraph FutureBackend [Future Upgrades]
        DB[(PostgreSQL / MongoDB\nProduction Data)]:::future
        Neo4j[(Neo4j Database\nKnowledge Graph)]:::future
        Temporal{Temporal.io\nDurable Execution}:::future
        Redis[(Redis\nEvent Bus & Pub/Sub)]:::future
    end

    %% External Gov APIs (Future)
    subgraph GovAPI [Government Portals]
        MCA[MCA / ROC Portals]:::gov
        GST[GST / Tax Portals]:::gov
    end

    %% Routing
    U1 -->|Logs in| Auth
    U2 -->|Logs in| Auth
    Auth -->|Token| AuthAPI

    U1 -->|Inputs Biz Details| IntakeUI
    IntakeUI -->|JSON payload| IntakeAPI
    IntakeAPI -->|Prompt| NVIDIA
    NVIDIA -->|Structured JSON| IntakeAPI
    IntakeAPI -->|Checklist| TimelineUI

    U2 -->|Monitors| DashUI
    U2 -->|Assigns Tasks| TaskUI
    TaskUI -.->|Schedules Workflow| Temporal
    TimelineUI -.->|Reads state| Temporal
    
    DashUI -->|Uploads PDF| ExtractAPI
    ExtractAPI -->|Text| VLM
    VLM -->|Parsed Entities| ExtractAPI
    
    GraphUI -.->|Cypher Query| Neo4j
    
    NotifAPI -.->|Pub/Sub| Redis
    
    %% Storage relations
    APILayer -.->|Read/Write| DB
    
    %% Gov relations
    Temporal -.->|Automated e-Filing| GovAPI
    
    %% Styling
    classDef user fill:#6366f1,stroke:#4f46e5,color:#fff,stroke-width:2px;
    classDef ai fill:#10b981,stroke:#059669,color:#fff,stroke-width:2px;
    classDef future fill:#f59e0b,stroke:#d97706,color:#fff,stroke-dasharray: 5 5;
    classDef gov fill:#ef4444,stroke:#dc2626,color:#fff,stroke-width:2px;
```

### Component Breakdown

1. **User Identity Flow (`AuthContext`)**: Users authenticate and are routed to their respective interfaces based on their Tier (1 or 2).
2. **AI Processing Flow**: When a user inputs natural language, it travels through the Next.js API layer out to NVIDIA's inference endpoints, returning structured JSON that populates the React state machines (Checklist Engine).
3. **[FUTURE UPGRADE] Durable Execution**: The `Temporal.io` worker cluster will handle long-running background tasks, such as waiting 30 days for a signature, and then firing off a payload to the Government API.
4. **[FUTURE UPGRADE] Graph Database**: True Neo4j integration will allow querying deep relationships (e.g., "Show me all forms required by the MCA that apply to companies with >100 employees").
5. **[FUTURE UPGRADE] Government API Integration**: The ultimate upgrade involves replacing manual form downloading with direct authenticated `POST` requests to Government e-Filing portals.
