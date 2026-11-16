# Rozix

Rozix is a modern website management and manufacturing system. This repository is the first production-quality Rozix installation, structured so that common functionality can later be extracted into a centralized Rozix Platform.

> **Build for extraction, don't implement extraction.**
> This phase establishes the foundation. Multi-tenancy, auth, the full CMS, and the page builder are intentionally not implemented yet.

## Architecture

Rozix separates five concerns:

| Concern            | Location                      | Responsibility                                      |
| ------------------ | ----------------------------- | --------------------------------------------------- |
| UI                 | `src/components/`             | React components that render. No business logic.    |
| Business logic     | `src/modules/`               | Domain services orchestrating app behavior.         |
| Database           | `src/db/`                     | Drizzle schema and a single shared DB client.       |
| Validation         | `src/lib/validations/`        | Zod schemas used at boundaries.                     |
| Configuration      | `src/lib/config/`             | Centralized env access and app/SEO config.          |

### Rendering pipeline

Pages are composed from structured sections resolved through a component registry:

```
Content -> Schema -> Component -> Tailwind -> HTML
```

```
section.type -> Component Registry (src/components/sections/registry.ts) -> React Component
```

### Design tokens

Brand colors are exposed as semantic CSS variables (`--color-primary`, `--color-secondary`, ...) in `src/styles/globals.css` and mapped into Tailwind via `@theme inline`. Components use semantic utilities (`bg-primary`, `text-foreground`) rather than hardcoded palette classes, so the future Rozix Branding system can override tokens per site.

## Technology stack

- Next.js (App Router, Server Components by default)
- React 19
- TypeScript (strict)
- Tailwind CSS v4 (CSS-first config)
- PostgreSQL (hosted on Supabase)
- Drizzle ORM + Drizzle Kit
- Zod
- ESLint + Prettier
- npm

## Project structure

```
src/
├── app/
│   ├── (site)/          # Public website route group
│   ├── admin/           # Admin shell and module placeholders
│   ├── layout.tsx       # Root layout (html/body, global metadata)
│   └── ...
├── components/
│   ├── ui/              # Reusable primitives (Button, Card, Input, ...)
│   ├── layout/          # Header, Footer, Navigation
│   └── sections/        # Section components + registry + renderer
├── modules/             # Domain business logic (sites, pages, services, ...)
├── db/
│   ├── schema/          # Drizzle schema (sites, ...)
│   ├── migrations/      # Reserved for migration artifacts
│   └── index.ts         # Shared Drizzle client
├── lib/
│   ├── validations/     # Zod schemas
│   ├── utils/           # Shared utilities (cn, ...)
│   ├── constants/       # Navigation items and other constants
│   └── config/          # env, seo, app configuration
├── types/               # Shared type definitions
└── styles/
    └── globals.css      # Tailwind import + design tokens
```

## Environment variables

Copy `.env.example` to `.env` and fill in the values:

```env
# Supabase PostgreSQL connection string (pooler URL recommended).
DATABASE_URL=

# Public application URL (no trailing slash).
NEXT_PUBLIC_APP_URL=http://localhost:3000

# UUID of the Site this installation manages (server-only).
# Set after creating your first site in /admin/settings.
ROZIX_SITE_ID=

# Supabase project URL (server-only, for Media storage).
SUPABASE_URL=

# Supabase service role key (server-only, for Media storage).
SUPABASE_SERVICE_ROLE_KEY=

# Media storage provider and bucket.
MEDIA_STORAGE_PROVIDER=supabase
MEDIA_BUCKET=rozix-media
```

`DATABASE_URL` and `ROZIX_SITE_ID` are server-only and never exposed to the client. A missing `DATABASE_URL` keeps the app bootable (lint/build/dev without DB) while making missing config explicit at the call site. A missing `ROZIX_SITE_ID` means no current site is resolved — the admin dashboard indicates this and the public site uses development fallbacks.

## Site management

Rozix manages a single **Site** entity per installation. A Site represents the business website being managed. The Site entity exists intentionally even though multi-tenancy is not implemented yet — the eventual Rozix Platform will manage multiple Sites.

### Creating the initial Site

1. Configure `DATABASE_URL` in `.env` (Supabase connection string).
2. Run migrations: `npm run db:migrate`
3. Visit `http://localhost:3000/admin/settings`.
4. Fill in the site name, slug, description, and status, then submit.
5. Copy the created site's UUID from Supabase (or Drizzle Studio: `npm run db:studio`) and set `ROZIX_SITE_ID` in `.env`.
6. Restart the dev server. The admin dashboard and public website now reflect the site's name and description.

### Current site resolution

`getCurrentSite()` in `src/modules/sites/site.service.ts` resolves the current site using `ROZIX_SITE_ID`. This is intentionally simple — it will be replaced by a platform/site resolver when multi-tenancy is introduced. The app does not crash if `ROZIX_SITE_ID` is unset; it returns null and the UI shows appropriate fallbacks.

### Site module architecture

```
UI (Server Component)
  ↓
Server Action (site.actions.ts)
  ↓
Site Service (site.service.ts)     — business rules, error mapping
  ↓
Site Repository (site.repository.ts) — DB operations only
  ↓
Drizzle ORM (src/db/)
  ↓
Supabase PostgreSQL
```

No UI component accesses Drizzle directly. All mutations go through server actions that validate input with Zod and call the service layer.

## Pages & sections

Rozix uses a controlled, schema-driven page composition system. Pages are relational records belonging to a site. Each page has ordered sections, and each section's configuration is stored as typed JSONB validated against a Zod schema.

### Hybrid content model

```
RELATIONAL                    PAGE COMPOSITION
───────────                   ────────────────
sites                         pages
collections                    └── page_sections
  ├── collection_fields              ├── type (string)
  ├── collection_items               ├── data (JSONB)
  └── templates                     └── position (integer)
```

Business content types (Services, Properties, Team, etc.) are implemented as **Collections** — a reusable, schema-driven content engine. See the [Collections](#collections) section below.

### Section type system

Six section types (three page-level, three collection-aware):

| Type | Component | Purpose |
|------|-----------|---------|
| `hero` | `HeroSection` | Headline with title, description, CTAs, optional image |
| `rich_text` | `RichTextSection` | Text block with optional heading and paragraph content |
| `cta` | `CtaSection` | Call-to-action band with button |
| `collection_grid` | `CollectionGridSection` | Grid of published items from the current collection (archive templates) |
| `collection_field` | `CollectionFieldSection` | Renders a single custom field value from the current item (single templates) |
| `collection_featured_image` | `CollectionFeaturedImageSection` | Renders the current item's featured image (single templates) |

Each section type has:
- A **Zod schema** (`src/modules/pages/sections/section.schema.ts`) validating its JSONB data
- A **React component** (`src/components/sections/`) that renders validated data
- A **registry entry** mapping type → schema + component

The renderer validates data against the schema before rendering. Unknown section types or invalid data do not crash the page — a development fallback is shown, and production silently omits invalid sections.

### Page module architecture

```
src/modules/pages/
├── page.types.ts              — types inferred from Drizzle/Zod
├── page.schema.ts             — Zod validation for page CRUD
├── page.repository.ts         — DB operations only
├── page.service.ts            — business logic, slug uniqueness, section delegation
├── page.actions.ts            — Server Actions (page + section mutations)
├── page.context.ts            — safe admin context wrapper
├── page.public-context.ts     — safe public page context wrapper
├── index.ts
└── sections/
    ├── section.types.ts       — SectionType, SectionDataMap
    ├── section.schema.ts      — Zod schemas per section type
    ├── section.registry.ts    — type → schema + label mapping
    ├── section.service.ts     — section CRUD, ordering, validation
    └── index.ts
```

### Rendering flow

```
Database → Page → Page Sections → Section Registry → Zod Validation → Component → HTML
```

### Public routing

- `/` — loads a published page with `slug = "home"`. Falls back to hardcoded development content when no DB or no published home page exists.
- `/[slug]` — loads any published page by slug. Returns 404 for draft/archived pages or unknown slugs.

### Admin pages

- `/admin/pages` — list of all pages with status, slug, and edit links
- `/admin/pages/new` — create a new page (title, slug, status, optional SEO)
- `/admin/pages/[id]` — page editor with section management (add, edit, delete, duplicate, move up/down)

### Page SEO

Pages have optional `metaTitle` and `metaDescription` fields. When set, these override the site-level defaults in the page's `generateMetadata()`. When unset, the site's name and description are used.

### Draft vs published

- **Draft** pages are not publicly accessible (only visible in admin)
- **Published** pages are publicly accessible at `/{slug}`
- **Archived** pages are not publicly accessible

Preview functionality for drafts requires authentication infrastructure that does not exist yet and is deferred to a future phase.

## Collections

Collections are Rozix's reusable content type system — a strongly typed, schema-driven alternative to hardcoded modules. Instead of building separate `services`, `properties`, or `team` modules, you create a **Collection** that defines the content type, its custom fields, and how it's presented.

> **A new business content type should normally be created as a Collection rather than a new hardcoded module.**

### Core concepts

| Concept | What it defines |
|---------|-----------------|
| **Collection** | What kind of content exists (e.g. Properties, Services, Team) |
| **Collection Field** | What data an item can contain (custom field definitions) |
| **Collection Item** | The actual content record |
| **Template** | How that content is presented (archive and single templates) |
| **Section** | A controlled presentation component (reused from the Page system) |
| **Page** | Normal page content/composition (unchanged) |

### System fields vs custom fields

Every Collection Item has stable Rozix-controlled system fields:

- `id`, `collection_id`, `title`, `slug`, `status`, `featured_image`, `created_at`, `updated_at`, `published_at`

Custom fields are collection-specific and stored in the `data` JSONB column, validated against the collection's field definitions before persistence.

### Archive vs single

A Collection can independently enable:

- **Archive** — a public listing page at `/{collection-slug}/` showing all published items
- **Single** — individual item pages at `/{collection-slug}/{item-slug}`

If archive is disabled, `/{collection-slug}/` returns 404. If single is disabled, `/{collection-slug}/{item-slug}` returns 404. Draft and archived items always return 404 publicly.

### Templates

Templates are composed from the existing Section architecture. A Collection assigns an archive template and a single template. Collection-aware sections (`collection_grid`, `collection_field`, `collection_featured_image`) receive Collection Context at render time.

### Collection Context

- **Archive Context**: `{ collection, items[] }` — passed to sections in archive templates
- **Single Context**: `{ collection, item }` — passed to sections in single templates

### Field types

Initial supported field types:

`text`, `textarea`, `rich_text`, `number`, `boolean`, `date`, `url`, `email`, `select`, `multi_select`, `image`, `gallery`

Reference and multi_reference field types are designed to be added later without rewriting the system.

### Database schema

```
sites
  └── collections (UNIQUE site_id + slug)
        ├── collection_fields (UNIQUE collection_id + key)
        ├── collection_items (UNIQUE collection_id + slug)
        │     └── data (JSONB — validated against field definitions)
        └── templates
              └── template_sections (reuses section registry)
```

### Rendering architecture

```
                         ROZIX
                           │
              ┌────────────┴────────────┐
              │                         │
            PAGES                  COLLECTIONS
              │                         │
         Page Sections            Collection Schema
              │                         │
              │                    Collection Items
              │                         │
              │                ┌────────┴────────┐
              │                │                 │
              │             ARCHIVE            SINGLE
              │                │                 │
              │             Template          Template
              │                │                 │
              └────────────────┴─────────────────┘
                               │
                        Template Sections
                               │
                      Collection Context
                               │
                       Section Renderer
                               │
                        React Components
```

### Creating a new Collection

1. Visit `/admin/collections` and click "New collection"
2. Set the name (e.g. "Properties"), singular name ("Property"), and slug ("properties")
3. Enable archive and/or single as needed
4. Add custom fields (e.g. Price → number, Location → text)
5. Create templates (archive and/or single) and add sections
6. Assign templates to the collection
7. Create items under the collection

### Example: Properties

```
Collection: Properties (slug: properties)
Fields: price (number), property_type (select), bedrooms (number), location (text)
Archive: enabled → /properties/
Single: enabled → /properties/luxury-villa
```

### Example: Services

```
Collection: Services (slug: services)
Fields: price (number), duration (text), featured (boolean)
Archive: enabled → /services/
Single: enabled → /services/physiotherapy
```

Both examples use the same Collection engine — no `properties.ts` or `services.ts` module exists in the codebase.

### Collection module architecture

```
src/modules/collections/
├── collection.types.ts          — Collection, ArchiveContext, SingleContext
├── collection.schema.ts         — Zod validation for collection CRUD
├── collection.repository.ts     — DB operations only
├── collection.service.ts        — business logic, slug uniqueness
├── collection.actions.ts        — Server Actions (all CRUD)
├── collection.context.ts        — safe admin context wrapper
├── collection.public-context.ts — safe public rendering context
├── collection-field.schema.ts   — Zod validation for field definitions
├── collection-field.repository.ts
├── collection-field.service.ts  — field CRUD, ordering, settings validation
├── collection-item.schema.ts    — Zod validation for item CRUD
├── collection-item.repository.ts
├── collection-item.service.ts   — item CRUD, data validation, publishing
├── template.schema.ts           — Zod validation for templates
├── template.repository.ts
├── template.service.ts          — template CRUD, section management
├── field-types.ts               — field type → Zod schema generation
└── index.ts
```

### Admin pages

- `/admin/collections` — list all collections
- `/admin/collections/new` — create a new collection
- `/admin/collections/[id]` — edit collection, manage fields, templates, and items
- `/admin/collections/[id]/items/new` — create a new item (form generated from field definitions)
- `/admin/collections/[id]/items/[itemId]` — edit item, publish, archive, delete

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Then visit:

- `http://localhost:3000` - public website (Header, Hero, Footer)
- `http://localhost:3000/admin` - admin dashboard
- `http://localhost:3000/admin/pages` - page management
- `http://localhost:3000/admin/collections` - collection management
- `http://localhost:3000/admin/settings` - site settings

## Database migrations

Drizzle Kit is used for schema management against Supabase PostgreSQL.

### Canonical workflow

```bash
# 1. Modify the Drizzle schema in src/db/schema/
# 2. Generate a migration from schema changes
npm run db:generate

# 3. Review the generated SQL in drizzle/XXXX_*.sql
# 4. Commit the migration AND drizzle/meta/ changes
# 5. Apply migrations to the database (requires DATABASE_URL)
npm run db:migrate

# 6. Verify the resulting database schema
npm run db:studio
```

### Commands

```bash
npm run db:generate   # Generate a new migration from schema changes
npm run db:migrate     # Apply committed migrations to the database (PRODUCTION)
npm run db:push        # Push schema directly (DEV ONLY — not for production)
npm run db:studio     # Open Drizzle Studio for schema inspection
```

### Rules

- **Migration files are append-only.** Never edit or delete an applied migration.
- **`drizzle/meta/` is tracked in Git.** It contains the migration journal and schema snapshots required for `db:generate` to produce incremental migrations. Do NOT gitignore it.
- **Line endings are forced to LF** for `drizzle/` via `.gitattributes`. Migration hashes are computed from file content; CRLF vs LF produces different hashes and breaks `db:migrate` on Windows.
- **`db:push` is NOT the production deployment strategy.** It bypasses the migration journal and is useful only for local development. Use `db:migrate` for all environments.
- **Never delete migration history to fix a generation problem.** If `db:generate` produces a full baseline instead of an incremental migration, the cause is a missing or inconsistent `drizzle/meta/` directory — restore it from Git, do not delete migrations.

## Build and start

```bash
npm run build
npm run start
```

## Lint, format, and typecheck

```bash
npm run lint
npm run typecheck
npm run format
npm run format:check
```

## Architectural principles

- Server Components by default; `"use client"` only when interactivity requires it.
- Database access stays inside `src/modules/` and `src/db/`; never inside UI components.
- Business logic lives in modules; UI components stay presentational.
- Validation with Zod at boundaries (API, server actions, forms).
- One shared database client (`src/db/index.ts`); no ad-hoc clients.
- Semantic design tokens instead of hardcoded brand colors.
- Build for extraction, not premature abstraction.

## Current limitations (intentionally unimplemented)

The following are out of scope for this phase and will be introduced later:

- Customer-facing authentication and user management (admin sign-in via Supabase Auth is implemented — any authenticated Supabase user is an admin in the current single-site phase)
- Drag-and-drop editor
- Reference and multi-reference fields between collections
- Taxonomies, filtering, search, and pagination for collection archives
- Multi-tenancy, organizations, memberships — the Site entity exists but multi-tenancy is intentionally not implemented. The current model is one Rozix installation per client, with `ROZIX_SITE_ID` resolving the single active site. This keeps the schema extraction-ready without premature platform abstraction.
- Billing and domain provisioning
- Email system, CRM integrations, AI content generation
- Media management and form builder
- Advanced permissions and analytics
- Supabase Auth, Row Level Security, Storage, Edge Functions, Realtime
- Site switching UI (only one active site per installation)

## Media & Asset Architecture

Rozix includes a Media & Asset domain model that establishes the foundation for centralized media management. This is an infrastructure layer — not a full Media Library — designed so existing and future modules can reference Media Assets instead of raw URL strings.

### Architecture

```
UI
  ↓
Server Action / Route
  ↓
Media Service (business rules, validation, site isolation)
  ↓
Storage Adapter (provider-independent interface)
  ↓
Supabase Storage (V1 provider)
```

Application code never calls Supabase Storage directly. The `MediaStorage` interface abstracts the provider; `SupabaseStorageAdapter` implements it. Future providers (S3, local, etc.) can be added by implementing the same interface.

### Media module structure

```
src/modules/media/
├── media.types.ts           — MediaAsset, MediaType, MediaVisibility
├── media.schema.ts          — Zod validation, MIME types, size limits
├── media.repository.ts      — DB operations only (no storage calls)
├── media.service.ts         — business logic, upload/delete, compensation
├── media.actions.ts         — Server Actions
├── media.context.ts         — safe admin context loader
├── media.storage.ts         — SupabaseStorageAdapter + factory
├── media.storage.types.ts   — MediaStorage interface
└── index.ts
```

### Media domain model

```
MediaAsset {
  id              UUID primary key
  siteId          FK → sites (ON DELETE CASCADE)
  type            enum: image | file (extensible to video, audio, document)
  mimeType        validated server-side
  filename        sanitized, used in storage key
  originalFilename  preserved for display
  storageKey      provider-independent identity: sites/{siteId}/media/{assetId}/{filename}
  publicUrl       resolved URL (nullable for future private assets)
  visibility      enum: public (extensible to private)
  alt             accessibility text (nullable — decorative images)
  title           accessibility title (nullable)
  width           image-only (nullable for non-images)
  height          image-only (nullable for non-images)
  size            file size in bytes
  createdAt, updatedAt
}
```

### Storage key strategy

Storage keys are generated by Rozix, never from user input:

```
sites/{siteId}/media/{assetId}/{sanitizedFilename}
```

The `assetId` UUID guarantees collision resistance regardless of filename. The `siteId` scopes the key to the owning site.

### File validation

- **Image MIME types**: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
- **File MIME types**: `application/pdf`
- **Image size limit**: 5 MB
- **File size limit**: 10 MB
- **SVG**: NOT accepted in V1 (Option A — safest). SVG can contain active content and no sanitization library is configured. Add a sanitization strategy before enabling SVG.
- **Executable formats** (`.exe`, `.bat`, `.cmd`, `.sh`, `.js`): rejected
- **Path traversal** (`../`, `..`, `/`, `\`, null bytes): stripped from filenames

### Supabase Storage setup

1. Create a **public** bucket named `rozix-media` in the Supabase dashboard (Storage → New bucket).
2. Set environment variables in `.env`:
   ```env
   SUPABASE_URL=https://<project-ref>.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
   MEDIA_STORAGE_PROVIDER=supabase
   MEDIA_BUCKET=rozix-media
   ```
3. The service role key is used server-side only — never exposed to the client.

### Admin diagnostic page

`/admin/media` shows:
- Whether storage is configured
- Total asset count
- A diagnostic table of existing assets

This is a diagnostic surface, not a Media Library UI.

### Future migration path

Existing URL-based fields remain unchanged in this milestone:

| Module | Current field | Future field |
|--------|--------------|-------------|
| Branding | `logo_url` (text) | `logo_media_id` (FK → media_assets) |
| Branding | `favicon_url` (text) | `favicon_media_id` (FK → media_assets) |
| SEO | `default_og_image` (text) | `default_og_media_id` (FK → media_assets) |
| Collection Items | `featured_image` (text) | `featured_media_id` (FK → media_assets) |

The migration will add explicit foreign keys (not a polymorphic reference table) and support a transitional period where both URL and Media ID fields coexist.
