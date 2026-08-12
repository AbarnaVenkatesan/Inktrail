# InkTrail 📝

A responsive blog platform built for the Frontend Development module (Day 1–4) — with a real user flow, not just static pages.

Live demo of the flow: register → land on your dashboard → write a post with a live markdown preview → publish → see it on the public feed.

## Features

- 🔐 **Authentication** — register/login with client-side validation (localStorage-backed)
- 📊 **Dashboard** — post stats (total, published, drafts, likes) and a management table (edit / publish / unpublish / delete)
- ✍️ **Editor** — split-pane markdown editor with live preview, tag chips, draft/publish toggle
- 🏠 **Home feed** — searchable, tag-filterable, with a typewriter hero and like buttons
- 📱 **Fully responsive** — mobile hamburger nav, fluid grid, tested down to 360px
- 🎨 **Custom design system** — ruled-paper editorial theme (no UI framework, no templates)

## Pages

| Page | File | Description |
|---|---|---|
| Home | `index.html` | Hero + public post feed with search & tag filters |
| Register | `register.html` | Create an account |
| Login | `login.html` | Sign in |
| Dashboard | `dashboard.html` | Protected — manage your posts |
| Write/Edit | `create.html` | Markdown editor with live preview |
| Post view | `post.html` | Single post reading view |

## Tech stack

- **HTML5** — semantic structure across 6 pages
- **CSS3** — custom properties, Grid & Flexbox, responsive breakpoints, no framework
- **Vanilla JavaScript** — auth, CRUD, markdown rendering, all hand-written
- **localStorage** — simulated backend (see `js/data.js`) — swap for a real API later without touching other files

## Project structure

```
inktrail/
├── index.html          Home / feed
├── login.html
├── register.html
├── dashboard.html
├── create.html          Write / edit post
├── post.html            Single post view
├── css/
│   └── style.css        Design tokens + components + responsive rules
└── js/
    ├── data.js           Data layer (users, posts, session)
    └── app.js            Shared utilities (nav, toasts, markdown parser, auth guard)
```

## Running it

No build step, no dependencies. Clone or download, then just open `index.html` in a browser.

```
git clone <your-repo-url>
cd inktrail
open index.html
```

## Demo account

```
email: demo@inktrail.dev
password: demo1234
```

## Notes

This project simulates a backend with `localStorage` so it runs entirely client-side for demo purposes. The data layer (`js/data.js`) is isolated so it can be swapped for real API calls without changing any page logic.
