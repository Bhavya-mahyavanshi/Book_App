# Book App

> A full-stack Next.js application for searching and saving books from the OpenLibrary API — with JWT authentication, protected routes, a persisted favourites list, and SWR-powered data fetching.

---

## What it does

Book App lets authenticated users search the OpenLibrary catalogue by author, title, subject, language, or publish year, browse paginated results, view individual book detail pages with cover art, and save books to a personal favourites list that persists across sessions. Authentication state and favourites are managed globally with Jotai atoms, and all data fetching uses SWR for automatic caching and revalidation.

Unauthenticated users are intercepted by a `RouteGuard` component that wraps the entire application and redirects to `/login` for any protected route — with no flash of protected content.

---

## Features

**Authentication**
- Register and login with username and password against a remote REST API (`NEXT_PUBLIC_API_URL`)
- JWT token stored in `localStorage`, decoded client-side with `jwt-decode` to extract the username for the nav dropdown
- `isAuthenticated()` checks token presence and validity on every route change
- Logout clears the token and redirects to `/login`

**Route protection**
- `RouteGuard` wraps `<Component />` in `_app.js` and listens to Next.js router events (`routeChangeStart`, `routeChangeComplete`)
- Public paths (`/login`, `/register`, `/about`) are explicitly whitelisted — all other routes require a valid token
- Content is hidden (`authorized: false`) during the route change and revealed only after the auth check passes — no flicker of protected content

**Book search**
- Search form on the home page accepts author (required), title, subject, language, and first publish year
- Only non-empty fields are included in the query string — no blank parameters pollute the URL
- Results page (`/books`) builds an OpenLibrary query string by joining non-empty params with ` AND ` and fetches `search.json` via SWR
- Client-side pagination: Previous / Next buttons with page state resetting to `1` on new searches

**Book detail pages**
- Dynamic route `/works/[workId]` — fetches the OpenLibrary Works API (`/works/{id}.json`) via SWR
- Displays cover image (with a `placehold.co` fallback if the cover is missing), title, description (handles both `string` and `{ value: string }` formats returned by the API), and first publish date

**Favourites**
- Add / remove any book from favourites via PUT/DELETE requests to the API with the JWT in the `Authorization` header
- Favourites list stored server-side (the API owns persistence) and synced into a Jotai atom on login and on every route change via `RouteGuard`
- `/favourites` renders a Bootstrap card grid — each card fetches its own cover and title independently via `BookCard` + SWR
- Button state in `BookDetails` reflects the current atom value: filled "Favourite (added)" vs outline "+ Favourite"

**Static generation**
- `/about` uses `getStaticProps` to fetch a specific OpenLibrary work at build time — the only page with server-side data, demonstrating Next.js hybrid rendering

---

## Architecture

```
Book_App/
├── pages/
│   ├── _app.js                 SWRConfig (global fetcher) → Layout → RouteGuard → Component
│   ├── index.js                Search form (react-hook-form, author required)
│   ├── books.js                SWR-fetched paginated results table
│   ├── works/[workId].js       Dynamic detail page via SWR
│   ├── favourites.js           Reads favouritesAtom → renders BookCard grid
│   ├── about.js                getStaticProps — pre-fetches one OpenLibrary work at build time
│   ├── login.js                Calls authenticateUser(), hydrates favouritesAtom on success
│   └── register.js             Calls registerUser(), redirects to /login
│
├── components/
│   ├── RouteGuard.js           Auth interceptor — listens to router events, protects all non-public paths
│   ├── MainNav.js              Bootstrap Navbar — shows user dropdown (username from decoded JWT) when authenticated, Register link when not
│   ├── Layout.js               Container wrapper around MainNav + page content
│   ├── BookCard.js             Fetches work data via SWR, renders cover + title + View button
│   ├── BookDetails.js          Full book view — cover, description, publish date, Add/Remove favourite button
│   └── PageHeader.js           Reusable Bootstrap Card with h2 + optional subtext
│
├── lib/
│   ├── authenticate.js         setToken / getToken / removeToken (localStorage) · readToken (jwt-decode) · isAuthenticated · authenticateUser · registerUser
│   └── userData.js             addToFavourites / removeFromFavourites / getFavourites — all with JWT Authorization header
│
└── store.js                    Jotai atom: favouritesAtom — single source of truth for the favourites list
```

**Key design decisions:**

- `SWRConfig` in `_app.js` provides a single global `fetcher` that throws on non-2xx responses — all `useSWR` calls across the app share this without repeating fetch boilerplate
- `RouteGuard` calls `updateAtom()` on every route change — so if the user adds a favourite on one page and navigates away, the atom is always in sync with the server on return
- `BookDetails` receives `showFavouriteBtn={false}` on the About page — the same component is reused for both the book detail page and the about page, with the button conditionally hidden
- `typeof book.description === "string"` guard in `BookDetails` — the OpenLibrary API returns description as either a plain string or `{ type, value }` object depending on the work; both cases are handled explicitly
- Search params are filtered with `Object.entries(data).filter(([, value]) => value !== "")` before being pushed to the router — blank fields produce no query parameters

---

## Tech stack

| | |
|---|---|
| Framework | Next.js 16 (Pages Router) |
| UI | React 18 + React Bootstrap 2 + Bootstrap 5 |
| State | Jotai 2 (`favouritesAtom`) |
| Data fetching | SWR 2 |
| Forms | react-hook-form 7 |
| Auth | JWT via `jwt-decode` 4, stored in localStorage |
| External API | [OpenLibrary](https://openlibrary.org/developers/api) (search, works, covers) |

---

## Getting started

**Prerequisites:** Node.js 18+. A running backend API that exposes `/login`, `/register`, `/favourites`, `/favourites/:id` (PUT), `/favourites/:id` (DELETE).

```bash
# Clone
git clone https://github.com/Bhavya-mahyavanshi/Book_App.git
cd Book_App

# Install
npm install

# Configure environment
echo "NEXT_PUBLIC_API_URL=https://your-api-url.com" > .env.local

# Run
npm run dev
# → http://localhost:3000
```

---

## Pages at a glance

| Route | Protection | Description |
|---|---|---|
| `/` | ✅ Auth required | Book search form |
| `/books` | ✅ Auth required | Paginated search results |
| `/works/[workId]` | ✅ Auth required | Individual book detail + favourite toggle |
| `/favourites` | ✅ Auth required | Saved books grid |
| `/about` | 🌐 Public | Developer page (statically generated) |
| `/login` | 🌐 Public | Login form |
| `/register` | 🌐 Public | Registration form |

---

## Author

**Bhavya Mahyavanshi** · Java Full-Stack Developer

[LinkedIn](https://linkedin.com/in/bhavya-mahyavanshi) · [GitHub](https://github.com/Bhavya-mahyavanshi) · [Portfolio](https://bhavya-mahyavanshi.vercel.app)
