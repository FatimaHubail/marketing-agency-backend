# MarkAura - API (Node.js)

## Project idea & description

MarkOra is a marketing agency management platform that manages the full lifecycle of a campaign from a client's initial request, through planning and execution by agency staff, to coordination with outsourced partners. Instead of managing this back-and-forth over emails and spreadsheets, MarkOra gives each party (clients, agency staff, and outsource partners) a role-based view of exactly what they need to act on next: clients submit and track campaign requests, staff review requests and manage active campaigns, and outsource agencies handle delegated tasks all through a single, status-driven workflow.

This repository contains the **Node.js/Express API** for MarkAura.

## User Stories

### Client
**Account & Profile**
- As a client, I want to register and log in to the platform, so that I can access my company's campaign data securely.
- As a client, I want to view and update my company profile, so that my contact and industry information stays accurate.
**Submitting Campaign Requests**
- As a client, I want to submit a new campaign request with my goals, budget, and preferred channels, so that the agency has everything it needs to start planning.
- As a client, I want to edit my request while it's still awaiting review, so that I can correct or refine details before staff starts working on it.
- As a client, I want to cancel a request I submitted, so that I'm not committed to a campaign I no longer need if it hasn't been accepted yet.
**Tracking Requests**
- As a client, I want to see a list of all my submitted requests and their statuses, so that I know where each one stands without contacting the agency directly.
- As a client, I want to view the details of a specific request, including which staff member it's assigned to, so that I know who's handling my account.
**Tracking Active Campaigns**
- As a client, I want to view the progress of my active campaigns, so that I can stay informed on timeline and budget without needing a status meeting.
- As a client, I want to see whether an outsource agency has been brought onto my campaign, so that I understand who's contributing to the work, even if I don't see their internal tasks.
**Reviewing & Feedback**
- As a client, I want to review campaign deliverables when they reach the review stage, so that I can confirm they match what I approved.
- As a client, I want to leave comments or request changes on a campaign draft, so that the agency can revise it before it goes live.
- As a client, I want to give final approval on a campaign, so that it can move forward to launch only once I'm satisfied.
**Boundaries**
- As a client, I want my data isolated from other clients, so that I never see requests or campaigns that aren't mine.
- As a client, I should not be able to change a request's status myself, so that only agency staff can validate and accept work into the pipeline.
### Agency staff
1.  As an agency staff member, I want to view the dashboard so I can see current activities.

2.  As an agency staff member, I want to review client request so I can decide how to handle them.

3. As an agency staff member, I want to manage campaigns so I can track their progress.

4.  As an agency staff member, I want to create and assign tasks so work is organized. 

5.  As an agency staff member, I want to assign work to external partners so they can complete specific tasks.

6. As an agency staff member, I want to review submitted work so I can approve it or request revisions. 

7. As an agency staff member, I want to view client information so I can manage their campaigns.


8. As an agency staff member, I want to track campaign progress so I know what is completed and what is pending.

9. As an agency staff member, I want to create, view, edit and delete requests, campaigns, tasks and clients information.



### Outsource agency

## Wireframes
Check out the wireframes sketching out layout and flow of the app covering the screens for clients, agency staff, and outsource partners across the request → campaign → task lifecycle.

### Client WireFrames

<div align="center">

[Open Client wireframes in Excalidraw](https://excalidraw.com/#json=HtugvHFQrEdtZtdNZ0Pr-,EjUBjAKtMfTTcD_qsOLgjA)

### Agent Staff WireFrames

### Outsource Partners Wireframes

</div>

## ERD

## Routing Tables

## Auth routes

| Method | Route | Access | Success | Errors | Notes |
|---|---|---|---|---|---|
| POST | `/api/auth/register` | public (client signup, incl. company fields) | `201 Created` | `400` invalid input · `409` email exists | Creates a `User` + `Client` profile in one call — this is the Register screen's "Create account" submit |
| POST | `/api/auth/login` | public | `200 OK` | `400` missing fields · `401` bad credentials | Returns an auth token/session used by every protected route below |
| GET | `/api/auth/me` | authenticated | `200 OK` | `401` no/invalid token | Used on app load to restore the session and populate the topbar user info |
| POST | `/api/auth/logout` | authenticated | `200 OK` | `401` no/invalid token | Invalidates the current session/token |

## Client routes

| Method | Route | Access | Success | Errors | Notes |
|---|---|---|---|---|---|
| GET | `/api/clients/me` | client | `200 OK` | `401` unauthenticated · `404` no client profile | Populates the Company Profile page |
| PUT | `/api/clients/me` | client | `200 OK` | `400` validation · `401` unauthenticated | "Save changes" on the Company Profile page |
| POST | `/api/requests` | client | `201 Created` | `400` validation (e.g. invalid goal for type) · `401` unauthenticated | "Submit" on the New Campaign Request form |
| GET | `/api/requests` | client (own only) | `200 OK` | `401` unauthenticated | Populates the My Requests table and the dashboard's request stats |
| GET | `/api/requests/:id` | client (owner) | `200 OK` | `403` not owner · `404` not found | Backs a request detail view (row expansion or a dedicated page) |
| PUT | `/api/requests/:id` | client (owner, `"submitted"` only) | `200 OK` | `400` validation · `403` not owner or already reviewed · `404` not found · `409` status no longer editable | Editing a request before staff starts reviewing it |
| DELETE | `/api/requests/:id` | client (owner, `"submitted"` only) | `204 No Content` | `403` not owner or already reviewed · `404` not found | The delete button on the My Requests page, only while still pending |

| GET | `/api/campaigns` | client (own only) | `200 OK` | `401` unauthenticated | Populates the My Campaigns page and its status tabs |
| GET | `/api/campaigns/:id` | client (owner) | `200 OK` | `403` not owner · `404` not found | Populates the Campaign Detail page (stepper, budget bar, review area) |
| PUT | `/api/campaigns/:id/review` | client (owner, `"client_review"` status only) | `200 OK` | `400` missing decision · `403` not owner or wrong status · `404` not found | "Approve" / "Request changes" buttons on the Campaign Detail page |

### Agency staff routes
![Image description](/images/REST%20API.jpeg)

### Outsource partners routes