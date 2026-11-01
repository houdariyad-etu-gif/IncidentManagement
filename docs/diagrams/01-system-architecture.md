# System Architecture

```mermaid
flowchart LR
    U[Employee / Technician / Admin] --> UI[React Frontend]
    UI -->|HTTP JSON + Bearer JWT| API[Spring Boot REST API]
    API --> SEC[Spring Security + JWT Filter]
    SEC --> CTRL[REST Controllers]
    CTRL --> SVC[Service Layer]
    SVC --> REPO[Spring Data JPA]
    REPO --> DB[(H2 / MySQL)]
    API --> ERR[Global Exception Handler]
```
