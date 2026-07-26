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

| Area | Interface | Purpose | Inputs | Writes | Required capability |
|---|---|---|---|---|---|
| Auth | `loginUser` | Sign in with credentials | email, password | JWT session | public |
| Auth | `registerUser` | Create student/staff account | name, email, password, department, phone | `users` | public |
| Categories | `createCategory`, `updateCategory`, `setCategoryActive` | Manage request categories | category fields | `requestCategories` | `category:manage` |
| Requests | `createServiceRequest` | Submit maintenance request | title, description, category, location, priority, attachments | `serviceRequests`, `statusLogs` | `request:create` |
| Requests | `updateRequestStatus`, `reopenRequest` | Move lifecycle status | request id, status, note | `serviceRequests`, `statusLogs`, `notifications` | officer assignment or reopen capability |
| Assignments | `assignOfficer` | Assign or reassign officer | request id, officer id, notes | `assignments`, `serviceRequests`, `statusLogs`, `notifications` | `request:assign` |
| Users | `createManagedUser`, `setUserActive` | Create/deactivate accounts | user fields, active flag | `users` | `user:manage` |
| Upload | `POST /api/upload` | Store evidence image | image file | Vercel Blob URL | signed-in user |
| Activity | `GET /api/activity/export` | Download CSV audit log | current activity query | CSV response | `activity:read` |

## 8. Screenshots of Major Interfaces

Screenshots are stored in `public/report-screenshots/`. The first capture target is the public landing page, followed by login/register, request submission, request detail timeline, officer queue, admin request overview, category management, user management, activity log, and notification bell.

## 9. Testing Evidence

Wave 1 scaffold evidence: `bunx tsc --noEmit` passed and `bun run lint` passed after tightening the shared input primitive types.

Wave 2 model evidence: model tests validate enum and required relationship constraints for roles, users, categories, and service requests.

Wave 3 evidence: `test:auth`, `test:rbac`, and `test:categories` passed with TypeScript and lint.

Wave 4 evidence: `test:auth-pages`, `test:submission`, and `test:tracking` passed with TypeScript and lint.

Wave 5 evidence: `test:officer`, `test:admin-requests`, and `test:users` passed with TypeScript and lint.

Wave 6 evidence: `test:upload` and `test:notifications` passed with TypeScript and lint.

Wave 7 evidence: `test:activity` and `test:polling` passed with TypeScript and lint.

## 10. Deployment Information

Deployment is intended for Vercel with production environment variables configured separately from local `.env.local` values.

## 11. Challenges Encountered and Solutions

- Priority behavior was clarified before implementation: urgent requests sort first in officer and admin queues.
- Reopening behavior was clarified before implementation: original requesters and administrators can reopen resolved or closed requests.

## 12. Conclusion

Imojuto centralizes maintenance intake, assignment, progress tracking, notification, and reporting for a university environment. It does not attempt SLA automation or native mobile delivery in this version; those are suitable extensions after the core workflow is stable.
