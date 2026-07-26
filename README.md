# Imojuto

Imojuto is a university maintenance and service-request platform. Students and staff submit faults with category, location, priority, and evidence. Maintenance officers work assigned queues and update progress. Administrators manage categories, accounts, assignments, audit activity, and CSV reporting.

The system replaces paper, phone, WhatsApp, and walk-in maintenance intake with one traceable workflow:

1. A requester submits a maintenance issue.
2. An administrator assigns the issue to an active maintenance officer.
3. The officer moves the request through assigned, in progress, and resolved states.
4. The requester or an administrator can reopen a resolved or closed request.
5. Status changes and assignments remain available in the audit log and CSV export.

## Roles

- Student/Staff: submit requests, track personal requests, attach evidence, reopen their own resolved or closed requests.
- Maintenance Officer: view active assignments, prioritize urgent work first, add work notes, and update status.
- Administrator: manage request categories, manage users, assign and reassign officers, reopen requests, review activity, and export CSV reports.

## Architecture

Imojuto is a Next.js 16 App Router application written in TypeScript. Server actions handle mutations so authorization checks stay next to writes. Route handlers are used only for authentication, image upload, and CSV export boundaries.

MongoDB with Mongoose stores roles, users, request categories, service requests, assignments, status logs, and notifications. Relationships are explicit ObjectId references, while request location and attachments are embedded because they belong to a single request.

NextAuth v5 provides credentials authentication with JWT sessions. The JWT includes `userId`, `roleId`, and permissions so route gating and server actions can enforce capability checks. Bcrypt stores password hashes. Vercel Blob stores evidence images. Nodemailer sends optional SMTP email notifications, while the notification collection powers in-app unread counts.

## Environment

Create `.env.local` with the values listed in `.env.example`. Local development needs MongoDB and seed admin credentials before the seed script can run. Uploads need `BLOB_READ_WRITE_TOKEN`. Email delivery needs the SMTP variables; without them, in-app notifications still work and email sending is skipped.

## Commands

```bash
bun run dev
bunx tsc --noEmit
bun run lint
bun run test:models
bun run seed
```
