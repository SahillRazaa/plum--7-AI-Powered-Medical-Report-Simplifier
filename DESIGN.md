# System Design: AI-Powered Medical Report Simplifier

## 1. Problem Understanding

The core objective is to create a backend service that ingests a medical report (either as text or an image), processes it through an AI-powered pipeline, and returns a structured, patient-friendly summary. The system must be robust, handle errors gracefully, and include a critical guardrail to prevent AI from hallucinating medical information not present in the source document.

## 2. High-Level Architecture

The service will be a monolithic Node.js application exposed via a REST API. The internal logic is designed as a sequential pipeline, where the output of one step serves as the input for the next.

**Data Flow Diagram:**

```mermaid
graph TD
    A[Client] -- multipart/form-data request --> B(API Server - Express.js);
    B -- Raw Request --> C{Controller};
    C -- Image/Text --> D[Service Layer];
    D -- Image --> E(OCR Service - Tesseract.js);
    E -- Raw Text --> D;
    D -- Raw Text --> F(AI Service - Normalization);
    F -- Structured JSON --> D;
    D -- Structured JSON --> G(AI Service - Simplification);
    G -- Simplified Text --> D;
    D -- Final JSON --> C;
    C -- HTTP Response --> A;
