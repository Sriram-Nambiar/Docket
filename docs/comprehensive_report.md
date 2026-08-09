# Docket Compliance Platform — Comprehensive Report

## Executive Summary
**Docket** is an AI-powered Enterprise Regulatory & Compliance Platform built using Next.js 16. It is designed to solve compliance orchestration for dual-sided audiences: **Tier 1 (Solo Founders / Department Collaborators)** who need guided, zero-friction intake, and **Tier 2 (Compliance Heads / Admins)** who require a complex command center for auditing, task assignment, and risk mitigation.

---

## 1. Core Architecture & Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI/Styling:** React 19, Tailwind CSS 4, Lucide React Icons
- **State & Layout:** Custom `AuthContext` (RBAC), Global Layouts, Responsive Sidebar
- **APIs:** Next.js Route Handlers (Serverless APIs)
- **AI Integration:** NVIDIA NIM (Llama 3.1 70B) for NLP parsing, extraction, and rule querying.
- **Eventing/Orchestration:** Redis (planned backend event bus), Temporal/LangGraph conceptual architecture for durable execution.

---

## 2. Implemented Modules (Live in Demo)

### A. Dual-Interface Access Control (RBAC)
- **Founder Intake (Tier 1):** A streamlined chat/form interface that uses AI to parse unstructured business descriptions into structured parameters (Turnover, Headcount, Sector) and generates instant baseline compliance checklists.
- **Compliance Dashboard (Tier 2):** A dense, Bento-style dashboard featuring real-time metrics, risk gauges, and a continuous audit feed.

### B. Core Compliance Engines
- **Checklist Engine Workbook:** A persistent, state-machine driven compliance checklist with 4 states: *Not Started, Evidence Uploaded, Filed & Verified, Overdue*.
- **Task Canvas:** A node-based, visual drag-and-drop orchestration graph (React Flow style) allowing compliance officers to wire tasks across departments.
- **Knowledge Graph View:** A Neo4j-inspired visualizer mapping relationships between Legal Entities, Statutes, Regulators, and Required Filings.
- **Orchestration Timeline:** A durable execution log simulating Temporal.io workflow traces (guaranteeing task completion across failure states).

### C. AI Automation Tools
- **Statutory Form Drafting:** An AI agent that pre-fills complex government forms (e.g., GSTR-3B, AOC-4) using historical entity data, pausing for human review.
- **Document OCR (VLM Pipeline):** A fallback pipeline for legacy, scanned, or handwritten government notices using Vision-Language Models.
- **Sector Modules:** Specialized regulatory packs (Healthcare/HIPAA, Manufacturing, Fintech).
- **Cost & Risk Tracking:** Real-time analytics calculating financial impact and penalty risk of non-compliance.

---

## 3. API Layer
- **`/api/auth/*`**: Handles mock JWT generation and Tier 1/Tier 2 identity validation.
- **`/api/intake`**: Calls NVIDIA NIM to parse natural language business descriptions into strict JSON compliance profiles.
- **`/api/extract`**: OCR abstraction endpoint to pull structured CIN, PAN, and Dates from raw text.
- **`/api/query`**: General regulatory RAG (Retrieval-Augmented Generation) endpoint answering statute-based questions.
- **`/api/notifications`**: Handles system-wide event broadcasting.

---

## 4. Production Readiness
- **Optimized:** Codebase compiles natively with Turbopack and strict linting.
- **Deployable:** Zero-config readiness for Edge networks like Vercel.
- **Graceful Degradation:** Built-in UI fallbacks ensure the platform functions smoothly even if external LLM APIs timeout.
