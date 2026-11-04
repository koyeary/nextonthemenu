# Next on the Menu
### Production Kitchen Operations Platform

**Role:** Independent Software Architect & Sole Engineer  
**Client:** Multi-location NYC bakery business  
**Status:** Deployed in production

## The Business Problem

A multi-location New York City bakery business relied on handwritten catering orders to coordinate kitchen production.

The existing process lacked several capabilities essential to managing orders reliably:

- **Station-specific order routing:** Catering orders could not be automatically printed at the appropriate kitchen stations.
- **Centralized order visibility:** Orders were not aggregated into a searchable system where staff could monitor their progress.
- **Order status tracking:** Kitchen staff lacked a shared digital workflow for tracking orders through production.
- **Point-of-sale integration:** The workflow was not synchronized with Square, leaving order information disconnected from the bakery's operational systems.
- **Inventory visibility:** Without centralized order data and integration, a global inventory view across bakery locations was not feasible.

These limitations created a need for a unified system connecting order intake, kitchen production, and the bakery's existing point-of-sale infrastructure.

## The Solution

I was engaged directly by the bakery's owners to independently architect, develop, and deploy a custom kitchen operations platform.

The system was designed to centralize catering orders, support kitchen-specific production workflows, integrate with Square, and establish the technical foundation for better operational visibility across locations.

I owned the technical delivery end to end, including application architecture, database design, integrations, implementation, and deployment.

## Architectural Objectives

1. Establish a centralized, searchable source of order information.
2. Support reliable routing of orders to appropriate kitchen stations.
3. Provide visibility into order status throughout production.
4. Integrate order information with Square.
5. Establish a data foundation for future cross-location inventory management.

## Technical Implementation

**Stack:** Next.js, TypeScript, PostgreSQL, Prisma, Square webhooks, and StarWebPRNT.

The architecture and implementation will be documented through system diagrams, architectural decision records, and selected code examples.

## Future Evolution

The architecture also provides a useful basis for examining additional capabilities, including cross-location inventory synchronization, integration reliability, and operational observability.
