# Imojuto Project Report

## 1. Introduction and Problem Statement

Imojuto is a web-based university maintenance request system designed to replace fragmented phone, paper, WhatsApp, and walk-in complaint handling. The current manual process provides no central tracking, weak accountability, and limited visibility into unresolved work. Imojuto gives students and staff a single place to submit faults, gives maintenance officers an assigned work queue, and gives administrators control over categories, users, assignments, activity, and reporting.

## 2. System Objectives

- Make every request traceable from submission to closure.
- Attribute every status change and assignment to a signed-in actor.
- Determine account capabilities through database-backed roles and permissions.
- Give administrators reports and audit evidence for operational oversight.

## 3. Requirement Analysis

| Requirement group | Implementation area |
|---|---|
| Frontend | Next.js App Router pages, reusable shell, responsive dashboards, forms, tables, timeline, notification UI |
| Backend | Server actions for mutations, route handlers for auth, upload, CSV export, SMTP mail service |
| Database | MongoDB collections for roles, users, categories, requests, assignments, status logs, notifications |
| Advanced features | Upload evidence, in-app/email notifications, audit trail, CSV export, polling updates |

## 4. Frontend Technologies Used

The frontend uses Next.js 16 App Router with React 19.2 and TypeScript. Tailwind CSS provides the design tokens and responsive layout system. The UI component layer follows shadcn-style primitives, customized for Imojuto instead of default demo styling. Lucide icons are used for clear navigation and category/action meaning. React Hook Form and Zod support validated forms. SWR provides polling for request lists, officer queues, and notifications.

## 5. Backend Technologies Used

The backend is implemented inside the Next.js application. Server actions handle request, assignment, category, user, notification, and status mutations. Route handlers are reserved for HTTP boundaries: NextAuth, uploads, and CSV export. NextAuth v5 handles credentials authentication with JWT sessions. Bcrypt hashes passwords. Mongoose provides MongoDB schemas and validation. Vercel Blob stores evidence images. Nodemailer sends assignment and status emails through SMTP.

## 6. Database Used and Relationships Supported

The system uses MongoDB through Mongoose. The database supports explicit ObjectId relationships: roles to users, users to service requests, users to assignments, categories to service requests, service requests to assignment history, service requests to status logs, and users to notifications. Small request-owned structures such as location and attachments are embedded because they are always read with the parent request.

## 7. API Documentation

This section is filled as server actions and route handlers are implemented.

## 8. Screenshots of Major Interfaces

Screenshots are stored in `public/report-screenshots/` and linked here as each major interface is completed.

## 9. Testing Evidence

This section records `tsc`, lint, build, and feature test evidence after each implementation wave.

## 10. Deployment Information

Deployment is intended for Vercel with production environment variables configured separately from local `.env.local` values.

## 11. Challenges Encountered and Solutions

- Priority behavior was clarified before implementation: urgent requests sort first in officer and admin queues.
- Reopening behavior was clarified before implementation: original requesters and administrators can reopen resolved or closed requests.

## 12. Conclusion

Imojuto centralizes maintenance intake, assignment, progress tracking, notification, and reporting for a university environment. It does not attempt SLA automation or native mobile delivery in this version; those are suitable extensions after the core workflow is stable.
