# Milika Tembo — Bibliotherapy portfolio

A static academic website for research, education and awareness. Content is edited in the browser through Decap CMS on Netlify. There is no counselling or appointment booking.

## Local preview

```bash
npm install
npm run dev
```

Open http://localhost:4321/

## Go live on Netlify

1. Push this project to GitHub or GitLab.
2. In Netlify, **Add new site → Import from Git**.
3. Build command: `npm run build`. Publish directory: `dist`.
4. Site settings → **Identity**: enable Identity, then enable **Git Gateway**.
5. Identity → **Invite users**: send an invite to the administrator.
6. Identity → **Emails**: set the template paths to `/admin/email-templates/invitation.html`, `confirmation.html`, `recovery.html` and `email-change.html`.
7. Site settings → **Forms**: confirm `speaking-enquiry` is listed after the first deploy. Turn on form notifications to the working email address.
8. Visit `https://your-site.netlify.app/admin/` to add blog posts, conferences, publications, ORCID, ResearchGate and a portrait. Use **Account** in the admin panel to change the login email or password.

Change the public email in **Site settings** inside the CMS before sharing the site widely. Update `site` in `astro.config.mjs` when you attach a custom domain.

## What the administrator can update without code

Open `/admin/` after signing in. Each collection maps to a public section:

- **Blog** — articles on the Blog page and Recent posts on the homepage
- **Events** — the Events calendar; items typed as Conference also appear under Research → Conferences
- **Doctoral project** — Complete / Working on / Upcoming items on Research → Doctoral Project
- **Book project** — the same status groups on Research → Book Project
- **Publications** — abstracts and papers on Research → Publications, grouped by status
- **Site settings** — name, email, location, LinkedIn, ORCID, ResearchGate, Facebook and portrait

Mark one upcoming event as **Feature on homepage** to replace the Canterbury feature when that conference has passed.
