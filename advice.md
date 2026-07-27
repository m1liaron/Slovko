# Slovko Architecture Review

This project has a good product foundation: the domain is clear, the feature set is meaningful, tests exist, and you already aim for offline support, auth, and reusable hooks. The main problem is not lack of features. It is weak boundaries. Data ownership, API contracts, async flow, and UI responsibilities are all mixed together, so the codebase will get slower to change as features grow.

## 1. Highest-priority improvements

### 1. Enforce ownership on every backend write and read

Authentication exists, but many controllers still trust `sectionId`, `groupId`, and `userId` from the client as if they were authorization proof.

- `backend/src/controllers/groupController.ts:13-18`, `:67-68`, `:121-149`, `:167-173`, `:191-204`
- `backend/src/controllers/cardsController.ts:18-54`, `:67-91`, `:160-265`, `:271-356`
- `backend/src/controllers/userController.ts:149-167`

Why this matters:
- A valid token should only allow access to that user's sections, groups, cards, and profile.
- Right now, if an attacker learns another `groupId` or `sectionId`, several endpoints can operate on foreign data because ownership is not consistently checked through `req.user.id`.

Advice:
- Make ownership checks part of repository/service methods, not controller-by-controller ad hoc logic.
- For cards, always prove ownership by joining `Card -> Group -> Section -> User`.
- For groups, always prove ownership by joining `Group -> Section -> User`.
- Never allow `PATCH /users/:userId` to update arbitrary users. Use `req.user.id` as the source of truth.

### 2. Stop mutating the schema at app startup

`backend/src/index.ts:37-43` runs `sequelize.sync({ alter: true })`.

Why this matters:
- `alter: true` is acceptable for prototypes, but it becomes dangerous once you care about production safety, rollback, repeatable deploys, or team collaboration.
- You already have Drizzle migrations. Running runtime schema mutation and migrations at the same time is a bad combination.

Advice:
- Pick migration-driven schema management only.
- Remove `sync({ alter: true })` from startup.
- Use explicit migrations for all schema changes.

### 3. Pick one ORM strategy

`backend/src/controllers/cardsController.ts` mixes Sequelize models with Drizzle queries in the same flow. Example: Sequelize for card/image persistence, Drizzle for `headwords`/`senses`.

Why this matters:
- Two ORMs means two mental models, two transaction models, duplicated schemas, and higher maintenance.
- It becomes harder to reason about consistency, especially once writes need to span both worlds.

Advice:
- Choose one of these directions:
- Keep Sequelize for app CRUD and isolate Drizzle to data-import scripts only.
- Or migrate operational code fully to Drizzle and remove Sequelize over time.
- Do not keep both as first-class runtime data-access layers.

### 4. Fix contract drift between frontend and backend

There is already evidence that the API contract is drifting:

- Backend route expects `GET /groups/:groupId/:sectionId` in `backend/src/routes/groupRoute.ts:16-19`
- Frontend calls `GET /groups/${groupId}` in `frontend/src/redux/groupReducer/groupThunk.ts:28-34`
- `frontend/src/hooks/GroupScreen/useGroupScreen.ts:25-29` then compensates by pulling from persisted storage instead of the server

Why this matters:
- This is exactly how stale-data bugs and "it works on my device" behavior start.
- Route strings are duplicated and untyped, so drift is easy and detection is late.

Advice:
- Define shared DTOs and route contracts.
- Either generate a typed client from backend schema/OpenAPI or create a shared `contracts` package with `zod` schemas and path constants.
- Do not rely on persisted Redux state to hide a broken API request path.

### 5. Fix the real bugs before adding more features

There are a few concrete defects worth fixing immediately:

- `backend/src/controllers/sectionController.ts:109` deletes groups with `where: { id: section.id }` instead of `where: { sectionId: section.id }`
- `backend/src/controllers/cardsController.ts:140-147` sets card status to `Know` or `Learned`, then immediately overwrites it with `Repeated`
- `frontend/src/redux/groupReducer/groupThunk.ts:28-34` calls a route that does not match the backend

These are not style issues. They directly affect correctness.

## 2. Frontend architecture improvements

### 6. Split `AddCardModal` into focused units

`frontend/src/components/Modals/AddCardModal/AddCardModal.tsx` is currently the largest frontend implementation file and handles:

- single-card form
- bulk import
- web file parsing
- mobile file parsing
- translation
- Unsplash search
- optimistic batch creation
- validation/formatting
- modal UI

Why this matters:
- A 37 KB modal is hard to test, hard to change safely, and will become the place where every future "small improvement" gets dumped.

Advice:
- Extract `useAddCardForm`
- Extract `useBulkCardImport`
- Extract `useCardTranslation`
- Extract `SingleCardForm`, `BulkImportPanel`, `ManualCardsEditor`
- Move parsing/formatting into pure utility modules with unit tests

### 7. Move third-party API calls out of the client

- `frontend/src/api/google-translate.ts:1-32`
- `frontend/src/api/unsplash.ts:1-25`

Why this matters:
- Client-side API keys are not secrets.
- You cannot properly rate-limit, rotate, audit, or swap providers when the mobile/web client talks to third parties directly.

Advice:
- Put translation and image-search behind backend endpoints.
- Let the frontend call your backend only.
- Cache repeated requests server-side where practical.

### 8. Simplify the async/offline model

The offline approach is ambitious, but the current implementation is brittle:

- `frontend/src/helpers/offlineHelpers/enqueueOrDispatch.ts:13-125`
- `frontend/src/redux/offlineQueueReducer/processOfflineQueue.ts:24-45`
- `frontend/src/redux/services/createAppAsyncThunk.ts:21-32`

Problems:
- heavy use of `any`
- queue processing depends on string prefixes
- thunk semantics are hard to reason about
- `createAppAsyncThunk` blocks all thunks when offline/auth is missing, even local-storage thunks such as `getGroupStorage`
- the order of "primary action" vs "fallback action" in `enqueueOrDispatch` is confusing

Advice:
- Model offline work as explicit commands, not raw thunk payload replay.
- Give each queued command a schema version and feature-owned handler.
- Separate network thunks from local-storage thunks.
- If possible, move to RTK Query for server state and keep offline commands as a small dedicated subsystem.

### 9. Reduce state coupling inside slices

`frontend/src/redux/cardReducer/cardSlice.ts:148-194` uses broad `isPending/isFulfilled/isRejected` matchers for every card-related async action.

Why this matters:
- One failed auxiliary request can mark the entire card domain as failed.
- Loading and error signals become too coarse for a feature-rich screen.

Advice:
- Track request state per operation (`fetchCards`, `addCard`, `bulkAdd`, `updateCard`, `reviewCards`).
- Keep entity state separate from request state.

## 3. Code quality and maintainability

### 10. Standardize localization and encoding

There is mixed localization strategy:

- `frontend/src/components/Card/CardItem/CardItem.tsx` contains hardcoded Ukrainian strings
- `AddCardModal` mostly uses `i18n`
- `Readme.MD` text is visibly encoding-damaged

Advice:
- Move all user-facing strings into localization files.
- Normalize UTF-8 everywhere.
- Add CI checks or editor config to avoid broken encodings entering the repo.

### 11. Centralize API access

Right now many thunks create Axios instances directly, route strings are handwritten, and response shapes are assumed.

Advice:
- Create a single API client layer with:
- auth injection
- retry/401 handling
- typed endpoint wrappers
- shared request/response schemas

This will reduce drift and make backend changes much cheaper.

### 12. Improve test depth, not just test count

The backend has CRUD happy-path tests, for example `backend/src/tests/card.test.ts`, but the highest-risk behaviors are not protected:

- authorization boundaries
- cross-user access attempts
- route contract mismatches
- offline queue replay
- bulk import edge cases
- startup/migration behavior

Advice:
- Add negative tests first.
- The most valuable test you can add next is: "user A cannot read/update/delete user B's group/card/user".

### 13. Tighten developer experience

A few signals show the repo still behaves like a prototype:

- root `package.json` still has placeholder test script
- README references `server` while the folder is `backend`
- naming is inconsistent (`Readme.MD`, `Tech.MD`, `CustomModal` vs `CustomModel`)

Advice:
- Clean scripts and docs until a new contributor can boot the project without guessing.
- A clean repo structure is leverage, not cosmetics.

## 4. Suggested refactor order

If I were mentoring this project, I would do the next work in this order:

1. Lock down backend authorization and fix the data-integrity bugs.
2. Remove `sequelize.sync({ alter: true })` and standardize migrations.
3. Fix frontend/backend route contracts and introduce shared API schemas.
4. Split `AddCardModal` and centralize API access.
5. Rebuild the offline queue around typed commands instead of replaying arbitrary thunks.
6. Add authorization and contract tests before new feature work.

## 5. What is already good

- The product scope is coherent.
- Redux entity adapters are a good direction for normalized state.
- You already separated some screen logic into hooks.
- There is real ambition here: offline support, spaced repetition, import flows, analytics, sharing.

That is a strong base. The next stage is to make the codebase trustworthy, not just feature-rich.
