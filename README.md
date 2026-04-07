# The Social Network

A full-stack server-side rendered blogging platform built with Node.js, Express, MongoDB, and EJS. Users can write blogs, read, like and comment on other user's blogs. Built in with an efficient admin panel for content and account moderation.

> Built from scratch without AI-generated code, as a demonstration of applied full-stack Node.js development with real-world concerns: authentication, security hardening, role-based access, and moderation tooling.

## Features

### User (Reader)
- **Account registration** with OTP-based email verification before access is granted
- **Session-based authentication** — login, logout sessions via `express-session`
- **Create posts** with image uploads (multimedia handled by `multer`)
- **Comment** on any post; OP (original poster) badge displayed on comments made by the post's author
- **Like posts**
- **Flash messages** on all key actions (login, post creation and updation, adding comments, account restriction etc.) via `connect-flash`

### Admin
- Dedicated admin login — role separation enforced at the middleware level
- Dashboard showing total users, total published blogs, and a full user list (username, join date)
- **Moderate content** — delete any post or comment
- **Restrict accounts** — restricted users can still log in but cannot create posts or comments; they receive a flash message informing them of the restriction on login
- **Terminate accounts** — permanently delete a user

### Security
- `helmet.js` configured with a **nonce-based Content Security Policy** to allow necessary inline scripts without weakening XSS protection — CSP headers are generated per-request with a fresh nonce injected into every EJS template
- MIME-sniffing prevention, XSS filter headers, and other Helmet defaults enabled

### Logging
- `winston` logger with multiple transports:
  - **Console** — debug level and above during development
  - **error.log** — error-level events only
  - **admin.log** — admin actions (restrictions, deletions, terminations)
  - **info.log** — general application events



## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose (ODM) |
| Templating | EJS (SSR) |
| Auth | express-session |
| Security | bcrypt, helmet.js |
| Logging | winston |
| Styling | Bootstrap |
| Email / OTP | Nodemailer, otplib |
| Multimedia | Multer


## Architecture

This is a **server-side rendered (SSR)** monolithic application. EJS templates are rendered on the server and served as complete HTML pages. All routing, business logic, and data access live in a single Express application.

```
├── controllers/     # Core backend logic for admin, auth and posts
├── logs/            # Server logs in three different transports
├── middlewares/     # Middleware logic used across the backend logic
├── models/          # Mongoose schemas: Post, User
├── public/          # Static assets (CSS, client JS, uploaded images)
├── routes/          # Express routers: Admin, Auth, Post
├── scripts/         # Scripts for testing 
├── utils/           # Config script for Winston logger
├── views/           # EJS templates
├── .gitignore       # Files and folders to ignore in Git
├── app.js           # Entry point
└── README.md        # Project documentation
```

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- An SMTP email account for OTP delivery (e.g. Gmail with App Password)

### Installation

```bash
git clone https://github.com/abythomas300/the-social-network.git
cd the-social-network
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
NODE_ENV = development/production
PORT = 3000
MONGO_URI = connection_string
SESSION_SECRET_KEY = session_secret_key

EMAIL_HOST = smtp.provider_name.com
EMAIL_SERVICE = email_service_provider_name
EMAIL_PORT = port_number
EMAIL_SECURITY_STATUS = true/false
EMAIL_SENDER_ADDRESS = sender_address
EMAIL_PASS = sender_password

OTPLIB_SECRET_KEY = otplib_secret_key

```

### Run

```bash
# Development
npm run dev

# Production
npm start
```

Visit `http://localhost:3000`

### Additional information

Create a `logs` directory in root to start storing server logs of all three different transports.


## Routes

Since this is an SSR application, all routes serve rendered HTML pages unless noted otherwise.

### Root & Auth 

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Landing page |
| `GET` | `/login` | Login page |
| `POST` | `/login` | Authenticate user, create session |
| `POST` | `/logout` | Destroy session, redirect to landing |

### Registration

| Method | Path | Description |
|---|---|---|
| `GET` | `/register` | Registration page |
| `POST` | `/register` | Submit registration form, trigger OTP email |
| `POST` | `/register/otpCheck` | Verify OTP, activate account |

### Posts

| Method | Path | Description |
|---|---|---|
| `GET` | `/post` | All posts feed |
| `GET` | `/post/newblog` | Blog creation page |
| `POST` | `/post` | Create new post (with thumbnail upload) |
| `DELETE` | `/post/:blogId` | Delete own post |
| `GET` | `/post/editBlog/:blogId` | Edit post page |
| `PATCH` | `/post/:blogId` | Update post (with optional new thumbnail) |
| `POST` | `/post/like/:blogId` | Toggle like on a post |
| `POST` | `/post/comment/:blogId` | Add a comment to a post |
| `GET` | `/post/myaccount` | Current user's profile page |

### Admin

| Method | Path | Description |
|---|---|---|
| `GET` | `/admin` | Admin dashboard |
| `GET` | `/admin/blogInfo` | All published blogs list |
| `GET` | `/admin/userInfo` | All users list (username, join date) |
| `GET` | `/admin/editBlog/:blogId` | Edit any blog page |
| `DELETE` | `/admin/deleteComment/:blogId` | Delete a comment ( `blogId` locates the post, `commentId` in request body identifies the specific comment ) |
| `DELETE` | `/admin/deleteUser` | Permanently delete a user account |
| `POST` | `/admin/restrictUser` | Toggle restriction on a user account |

## Notable Implementation Details

**Nonce-based CSP with Helmet**
Helmet's default CSP blocks all inline scripts. Since EJS templates require inline `<script>` blocks for functionality, a custom middleware generates a cryptographic nonce on every request, attaches it to `res.locals`, and passes it to Helmet's CSP configuration. All inline scripts reference this nonce via `<script nonce="<%= nonce %>">`.

**Account Restriction System**
Restriction is a soft-block — the user's account remains active and they can log in. A `isRestricted` flag on the user document is checked at the middleware level on any write operation (post creation, commenting). On login, a flash message is shown if the account is restricted. This makes moderation reversible while still being immediate.

**OTP Verification Flow**
On signup, a time-limited OTP is generated, stored temporarily, and sent to the user's email via Nodemailer. The account is only activated once the OTP is verified — unverified accounts cannot log in.

## Status

Functional and complete. Deployment is in progress.

This project will continue to evolve over time.

## Contribution
See somthing you can improve? Submit a PR or raise an issue.


