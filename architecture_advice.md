Assessment
The product scope is coherent, but the codebase is currently split between two different architectures: a CRUD app around Sequelize and a content/catalog subsystem around Drizzle. The biggest verified gaps are:
Persistence is mixed in one runtime path. backend/src/controllers/cardsController.ts writes user data through Sequelize while also querying dictionary data through Drizzle via backend/src/db/sequelize.ts and backend/src/drizzle/index.ts.
The curated deck/catalog path exists but is not actually wired into the app. backend/src/controllers/deckController.ts and backend/src/routes/deckRoute.ts exist, but deckRoute is not mounted in backend/src/index.ts.
Mobile onboarding still uses hardcoded/local data instead of backend catalog data in frontend/src/screens/ChooseLanguageScreen/ChooseLanguageScreen.tsx and frontend/src/screens/ChooseWordsScreen/ChooseWordsScreen.tsx.
Offline/auth state is spread across persisted Redux, AsyncStorage, and globals in frontend/src/redux/store.ts, frontend/src/helpers/offlineHelpers/enqueueOrDispatch.ts, frontend/src/redux/userReducer/userSlice.ts, and frontend/src/utils/storage/initToken.ts.
Third-party integrations are still client-side in frontend/src/api/google-translate.ts and frontend/src/api/unsplash.ts, which is the wrong boundary for keys, rate limiting, and caching.
I also verified current health:
Backend tests do not currently start cleanly. vitest fails before running the suite because importing the app triggers bootstrap logic and ensureLanguages() against a schema that is not initialized yet.
Frontend type-check currently fails immediately because frontend/tsconfig.json uses an invalid ignoreDeprecations: "6.0" setting.
Best Architecture
For this project, the right target is a modular monolith, not microservices.
Keep one backend API, one PostgreSQL database, and one mobile app.
Standardize the backend on Drizzle + Postgres + migrations only. Remove Sequelize from runtime code over time.
Introduce repo workspaces: apps/mobile, apps/api, packages/contracts, packages/srs-engine.
Put all request/response DTOs and validators in packages/contracts using zod. The mobile app and API should both consume the same contracts.
Split the API by domain modules:auth
library for user sections/decks/cards
study for due reviews, sessions, streaks, results
catalog for languages, starter decks, dictionary/headwords
sharing for public/shared decks
media for translation/image lookup
sync for offline reconciliation

Separate app creation from process startup: createApp() and startServer(). Tests should import the app without opening listeners or seeding on import.
Mobile Architecture
The current Redux-persist approach is not strong enough for real offline-first behavior.
Use SQLite on device for user library, due cards, results, and sync outbox. In Expo, expo-sqlite is the pragmatic choice.
Keep Redux only for UI/session/preferences. Do not use it as the main database for cards/groups/results.
Use RTK Query for network endpoints and cache invalidation, with a dedicated sync worker that flushes an outbox when online.
Make sync explicit:local writes go to SQLite immediately
mutations are written to an outbox table
backend accepts idempotent commands
app pulls server deltas by cursor/version

Move translation, Unsplash lookup, bulk import enrichment, and notification scheduling behind backend endpoints or jobs.
Domain Model
The app needs clearer product language. Right now section, group, and deck overlap.
I would normalize the core model to:
User
LanguageWorkspace or keep Section if you do not want a rename
Deck for the current Group
Card
StudySession
StudyAnswer
StreakEvent
StarterDeck / CatalogDeck
SharedDeck
That gives you a clean split between:
personal library
curated content catalog
learning/progress engine
social sharing
Migration Order
Stabilize bootstrap: add createApp(), stop side effects on import, fix tests.
Add packages/contracts and stop duplicating route strings and DTO shapes.
Choose Drizzle as the only backend data layer and migrate feature-by-feature.
Mount the catalog/deck module and replace hardcoded onboarding data with real API-backed catalog data.
Replace Redux-persisted entity state with SQLite + outbox sync.
Move translation/image integrations to backend and add a small background-job layer for slow/enrichment work.