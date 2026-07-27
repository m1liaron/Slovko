# 🔍 Slovko — Deep Code Audit

**Date:** 2026-06-10
**Scope:** Full monorepo — React Native (Expo) frontend + Express / Sequelize / Drizzle backend
**Reviewer:** Automated deep audit (security, correctness, performance, React patterns, clean code)

---

## Executive summary

Slovko is a feature-rich flashcards app with a solid feature set and a generally clean folder structure (feature-sliced hooks, redux slices/thunks, typed enums). However, the audit found **systemic broken access-control (IDOR) on the backend**, several **mass-assignment / plaintext-password** issues, and a number of **correctness bugs that silently swallow errors or hang requests**. There is also an architectural smell of **two ORMs (Sequelize + Drizzle)** coexisting.

| Severity | Count | Headline issues |
|----------|-------|-----------------|
| 🔴 Critical | 8 | IDOR on cards/groups, `updateUser` account-takeover + plaintext password, points mass-assignment, open CORS, TLS verify disabled |
| 🟠 High | 10 | Error swallowing / hung requests, logic-operator bug, fire-and-forget DB writes, no-op hook |
| 🟡 Medium | 9 | `sync({alter})` in prod, dual ORM, in-memory pagination, broken `memo`, N+1 inserts |
| 🟢 Low | 12 | Leftover `console.log`, dead code, typos, missing tests, inconsistent error shapes |

**Top 5 to fix first**
1. Add per-user ownership checks on all card/group/section/result/shared-group access (IDOR).
2. Lock down `PATCH /users/:userId` — ownership + field allowlist + `beforeUpdate` password hashing.
3. Stop accepting `points` (and other privileged fields) from request bodies.
4. Fix `sendError` / `authMiddleware` so non-`Error` rejections still respond (no hung requests).
5. Restrict CORS and re-enable TLS certificate verification.

---

## 🔴 Critical (security)

### C1. Broken Object Level Authorization (IDOR) across cards & groups
`backend/src/controllers/cardsController.ts`, `groupController.ts`, and their routes (`cardRoute.ts`) operate purely on raw IDs with **no check that the resource belongs to the authenticated user**.

```ts
// cardRoute.ts — only authMiddleware, nothing scopes to req.user
router.route("/:id").delete(removeCard).patch(updateCard);
router.route("/:groupId").get(getAllCards);
```
```ts
// removeCard — any authenticated user can delete ANY card by id
const card = await Card.findOne({ where: { id: cardId } });
await card.destroy();
```
`getAllCards`, `getCardsFromIds`, `getAllStatusCards`, `updateCard`, `removeCard`, `updateCardsAfterReview` are all affected. `groupController` filters by `sectionId` from params but never verifies that section belongs to `req.user`.

**Impact:** Any logged-in user can read, edit, or delete every other user's data.
**Fix:** Join through `Section.userId` (Card → Group → Section → userId) and add `WHERE userId = req.user.id` (or a reusable ownership guard) to every object-level query.

---

### C2. `updateUser` — account takeover + mass assignment + plaintext password
`backend/src/controllers/userController.ts` → `updateUser`, route `patch("/:userId", authMiddleware, updateUser)`.

```ts
const [, users] = await User.update(body, { where: { id: userId }, returning: true });
```
Three compounding problems:
- **No ownership check** — any authenticated user can update *any* `userId`.
- **Mass assignment** — the entire `req.body` is written, so `email`, `points`, `streak`, `frozen`, `password` can all be overwritten.
- **Plaintext password** — `User` only defines a `beforeCreate` hook to hash. `User.update` does **not** trigger it (and no `beforeUpdate` exists), so a password set here is stored in cleartext, **defeating bcrypt** and enabling account takeover of any user.

**Fix:** Enforce `userId === req.user.id`; whitelist updatable fields (`name`, `image` only); add a `beforeUpdate`/`beforeSave` hook that re-hashes `password` when changed, or route password changes through a dedicated, current-password-verified endpoint.

---

### C3. `register` accepts `points` from the body (privilege/economy abuse)
```ts
const { email, password, name, points } = req.body;
const user = await User.create({ email, password, name, points });
```
`points` is the in-app currency used by `buyFreeze`. A client can self-grant unlimited points at registration. **Fix:** never accept `points`; initialize from the model default (0).

---

### C4. CORS is fully open
`backend/src/index.ts`:
```ts
app.use(cors()); // reflects any origin
```
**Fix:** `cors({ origin: [allowedOrigins], credentials: true })`.

---

### C5. TLS certificate verification disabled in production
`backend/src/db/sequelize.ts`:
```ts
dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
```
`rejectUnauthorized: false` accepts any certificate → MITM exposure on the DB connection. **Fix:** supply the CA and set `rejectUnauthorized: true`.

### C6. No rate limiting / brute-force protection
`/users/login` and `/users/register` have no throttling. Combined with a 4-char minimum password, credential stuffing is trivial. **Fix:** add `express-rate-limit` on auth routes; raise password minimum to ≥8.

### C7. Secrets shipped in the client bundle
`frontend/src/api/google-translate.ts` and `unsplash.ts` read `process.env.GOOGLE_TRANSLATE_API` / `process.env.API_UNSPLASH_KEY`. In React Native these are **inlined into the app bundle** and are trivially extractable. **Fix:** proxy translation and image search through the backend (the backend already wraps Unsplash) and keep keys server-side.

### C8. JWT stored in unencrypted AsyncStorage
`frontend/src/utils/storage/asyncStorage.util.ts` stores the 30-day token in `AsyncStorage` (plaintext on device). **Fix:** use `expo-secure-store` (Keychain/Keystore) for the token. Also note `helmet()` is only applied in `index.certificated.ts`, not in the main `index.ts`.

---

## 🟠 High (correctness / reliability)

### H1. `sendError` swallows non-`Error` rejections → request hangs
`backend/src/helpers/sendError.ts`:
```ts
const sendError = (res, error: any) => {
  if (error instanceof Error) { res.status(500)...; }
  // else: NOTHING sent — the request hangs until the client times out
};
```
Sequelize/driver rejections aren't always `Error` instances. **Fix:** always respond; log the unexpected shape.

### H2. `authMiddleware` can hang on non-`Error` throws
```ts
} catch (error) {
  if (error instanceof Error) { return res.status(401)...; }
  // else: no response, next() never called
}
```
Same hang pattern. Also it does a full `User.findByPk` DB round-trip on every request but then trusts `decoded.userId`/`decoded.name` — acceptable but it's an extra query per request.

### H3. Logic-operator bug + dead status logic in `updateCardsAfterReview`
```ts
if (!Array.isArray(cardsIds) && cardsIds.length <= 0) { ... } // should be ||
...
if (card.reviewCount >= 12) card.status = "Know";
else card.status = "Learned";
card.status = "Repeated"; // ← unconditionally overwrites the above; "Know" is never reachable
```
The `&&` means a non-array body skips validation and then crashes on `.length`; the "Know/Learned" branch is dead code. **Fix:** use `||`; remove or correctly order the status assignment.

### H4. Fire-and-forget DB writes in `copySharedGroup`
```ts
await Promise.all(sharedGroup.sharedCards.map(async (card) => {
  ...
  Card.create({ ... }); // not returned / not awaited
}));
```
The `Promise.all` resolves before the cards are actually inserted; failures are silently lost and the response may be sent before the copy completes. **Fix:** `return Card.create(...)` (ideally `bulkCreate`).

### H5. `addCard` crashes on missing fields
```ts
if (!word.length || !translateWord.length) // throws if word/translateWord undefined → 500
```
**Fix:** guard for presence first (`if (!word || !translateWord)`), return 400.

### H6. `getGroup` sends a 200 error then double-responds
```ts
if (!group) { res.status(200).send({ error: true, message: "Group does not exist" }); }
res.status(200).json(group); // runs anyway → possible "headers already sent"
```
**Fix:** `return` after the not-found response and use 404.

### H7. Unawaited `user.save()` in `getUser`
```ts
user.lastReviewAt = today;
user.save(); // not awaited — unhandled rejection, possible lost write
```

### H8. `index.certificated.ts` loads the wrong cert file
```ts
const SSL_CERT_PATH = process.env.SSL_CERT_PATH || "../certs/key.pem"; // should be cert.pem
```
Copy-paste bug — HTTPS server gets the private key where the certificate is expected.

### H9. `useNetworkStatus` is a no-op hook
`frontend/src/hooks/useNetworkStatus.ts` sets internal state but **returns nothing** (`_isConnected` is never exposed). Any caller relying on it gets `undefined`. Either return `{ isConnected }` or delete it (connectivity already flows through `ConnectivityListener` + `networkSlice`).

### H10. `removeSharedGroup` dead-code ownership branch without `return`
The query already filters `userId: req.user.id`, so the later `if (sharedGroupData.userId !== req.user.id) res.status(400)...` is unreachable — and if it weren't, it lacks `return` and would fall through to `destroy()`. Clean up to a single guard.

---

## 🟡 Medium (performance / architecture)

### M1. `sequelize.sync({ alter: true })` on every startup (incl. production)
`backend/src/index.ts` runs schema-altering sync at boot. This is slow, can silently mutate/lock production tables, and conflicts with the committed migration files. **Fix:** use migrations only; never `alter` in production.

### M2. Two ORMs / two sources of schema truth
The project defines tables both as **Sequelize models** (`src/models/*`) and as **Drizzle schema + migrations** (`src/drizzle/*`), and `cardsController` mixes raw Drizzle `db.execute` with Sequelize `Card.findAll` in the same handler. This doubles maintenance and invites drift. **Decide on one ORM** (or clearly scope Drizzle to the read-only dictionary tables and Sequelize to app tables, documented in `Tech.MD`).

### M3. In-memory pagination in `getAllSharedGroups`
```ts
const allSharedGroups = await SharedGroup.findAll({ include: { User } }); // loads EVERY row
const filtered = allSharedGroups.slice(skip, skip + itemsPerPage);
```
Loads the entire table (with joined users) on every page request. **Fix:** push `limit`/`offset` into the query and `count` separately. Also `page` defaults to `"0"` but `|| 1` makes the effective default 1 — inconsistent.

### M4. `getAllGroups` runs 4 correlated subqueries per group
Four `SELECT COUNT(*) … WHERE status = …` literals per group row. **Fix:** a single `GROUP BY` with `COUNT(*) FILTER (WHERE status = …)` (Postgres) or one aggregate join.

### M5. N+1 inserts in `createSharedGroup` / `copySharedGroup`
Individual `SharedCard.create` / `Card.create` per word inside `Promise.all`. **Fix:** `bulkCreate`. Same shape in `getRepeatedCards` (a `findAll` per group — collapsible into one query).

### M6. `memo(CardItem)` is defeated in `CardList`
`frontend/src/components/Card/CardList/CardList.tsx`:
```ts
const MemoCardItem = memo(CardItem);
...
renderItem={({ item }) => (
  <MemoCardItem onRemove={() => dispatch(...)} ... /> // new closure every render
)}
```
A fresh `onRemove` function (and inline `renderItem`) is created each render, so the memo never hits. Also `useEffect(..., [group, groupId])` depends on the `group` object reference and omits `dispatch`. **Fix:** `useCallback` the row press/remove handlers, hoist `renderItem`, and add FlatList perf props (`initialNumToRender`, `windowSize`, `removeClippedSubviews`, `getItemLayout`). The `contentContainerStyle={{ height: height/2 }}` also artificially clips the scroll area.

### M7. New axios instance + AsyncStorage read on every request
`createAuthorizedInstance` is called per request via `withAuth`, rebuilding an axios instance and re-reading the token each time. **Fix:** create one instance with a request interceptor that injects the current token.

### M8. redux-persist whitelist persists transient/heavy state
`store.ts` whitelists `network` (live connectivity — should never be rehydrated) and large `cards`/`results` collections. Rehydrating `network.isConnected` can leave the app believing it's online/offline incorrectly at cold start. **Fix:** drop `network` from the whitelist; reconsider persisting bulky server-cache slices.

### M9. `useLearnCards` reshuffles on every render
```ts
const sortedWords = [...initialCards].sort(() => Math.random() - 0.5); // runs each render
const [learningCards] = useState(sortedWords);
```
The shuffle is recomputed on every render but only used as initial state (wasted work), and `Array.sort(() => Math.random()-0.5)` is a biased shuffle. The `setTimeout`s in `handleSwipeRight/Left` are never cleared on unmount. **Fix:** lazy initializer `useState(() => shuffle(initialCards))` with a proper Fisher–Yates shuffle, and clear timeouts in a ref/cleanup.

---

## 🟢 Low (clean code / consistency / tooling)

- **L1. Leftover debug logging** — 31 `console.log` in backend (`"GroupId: "`, `"Headword: "`, `"Shared cards to copy: "`, etc.) and 8 in frontend. Route through the existing `winston`/logger or strip.
- **L2. Dead code in `ProtectedRoute`** — `if (isLoading) return <Loading/>` is immediately followed by `return isLoading ? <Loading/> : <NavigationContainer/>` (the true branch is unreachable). Two `useEffect`s also race (`initToken` vs. the token read).
- **L3. Typos** — `erorr: true` (copySharedGroup), class `CustomModal` (should be `CustomModel`, used across all models), grammar in messages ("User already exist", "does not found").
- **L4. Inconsistent error response shape** — mix of `{ error: true, message }`, `{ error: "string" }`, and `{ erorr }`. Standardize one error envelope.
- **L5. App.tsx** — unused `View` import from `moti`; no `SafeAreaProvider`; import ordering (`Toast`, `View`) violates the configured `import/order` rule.
- **L6. `EnvVariables`** — `PORT` typed as `string | number`; `NODE_ENV` defaults to `"localhost"` while the prod branch checks `=== "production"` (use `development`/`production`). `validate-env` requires `JWT_LIFETIME` but the code hardcodes `"30d"` in `createJWT`.
- **L7. Root tooling mismatch** — root `package.json` `test` script just errors; root `lint-staged` targets `*.ts`/`*.html`/`*.scss` while the codebase is `.tsx`/`.ts` (the frontend has its own correct config, but the root one is misleading).
- **L8. Magic strings for card status** — `"To Learn" | "Repeated" | "Know" | "Learned"` repeated across controllers; extract a shared enum/const on the backend (frontend already has `enums/`).
- **L9. `any` usage** — 12 in frontend (`rootReducer` `action: any`, several thunks), warned-only by eslint. Type the action with `AnyAction`/`UnknownAction`.
- **L10. Committed cruft** — `.DS_Store` and `.expo/` are tracked; add to `.gitignore`.
- **L11. No frontend tests** — backend has a Vitest suite (good); the frontend has zero tests. Add React Native Testing Library coverage for the learn flow and redux thunks.
- **L12. `getCardsFromIds` trusts raw body as ID array** without per-id ownership filtering (ties back to C1) and without bounding the array length (potential large `IN (...)`).

---

## What's done well
- Clean feature-sliced structure: per-feature hooks (`hooks/LearnCards`, `hooks/GroupScreen`), redux slices/thunks/selectors separated, typed `common/enums`.
- Thoughtful offline support: `offlineQueue` + `enqueueOrDispatch` + a re-entrancy guard (`isProcessingQueue`) in `processOfflineQueue`.
- Centralized 401 handling via the `authEvents` pub/sub + axios response interceptor → `logout()` + `persistor.purge()`.
- Backend has a real Vitest test suite and parameterized validation in `getUserStreakDates`.
- `User.toJSON()` strips the password; shared-group/user includes use `attributes: { exclude: ["password"] }` in most places.

---

## Suggested remediation order
1. **Auth/access control (C1, C2, C3)** — add an ownership guard and field allowlists; add a `beforeUpdate` password-hash hook. *Highest impact, data-integrity critical.*
2. **Transport/secrets (C4, C5, C6, C7, C8)** — CORS allowlist, TLS verify, rate limiting, move API keys server-side, SecureStore for the token, `helmet` in the main entry.
3. **Reliability bugs (H1–H10)** — fix error swallowing/hangs, the `&&`/dead-status bug, fire-and-forget writes, the cert-path bug, the no-op hook.
4. **Architecture/perf (M1–M9)** — drop `sync({alter})`, decide on one ORM, real pagination, fix `memo`/FlatList, single axios instance, trim persist whitelist.
5. **Cleanup (L1–L12)** — strip logs, remove dead code, fix typos/enums/types, add frontend tests, untrack `.DS_Store`.

---

*Generated by an automated deep audit. Line references are accurate as of commit `53217ef`. Validate each fix against the test suite before merging.*

---
---

# 📎 Appendix A — React Patterns Review (specialist agent)

> Focused pass on hook correctness, effect cleanup, derived-state anti-patterns, and idiomatic RTK usage. **New findings** not in the main report above.

## 🔴 Critical
- **A1. Conditional hook — `useEffect` inside `if (Platform.OS === 'web')`** — `components/Learn/LearnGuessWord/LearnGuessWord.tsx:131`. Violates the Rules of Hooks (flagged by `react-hooks/rules-of-hooks`); move the effect to the top level and guard its *body*.
- **A2. `useNetworkStatus` returns nothing** — `hooks/useNetworkStatus.ts:4` (also H9 above). Confirmed dead: every caller gets `undefined`. Return `{ isConnected }` or delete and use `useAppSelector(s => s.network.isConnected)`.

## 🟠 High
- **A3. `useTypeMode` effect missing `currentCardIndex`/`handleFlipCard` deps** — `hooks/LearnCards/useTypeMode.ts:25`. Card flip is skipped for every card after the first in type-mode — a real learning-flow bug. Add the deps.
- **A4. `useGroupFilters` calls `setRangeLimit()` un-dispatched** — `hooks/GroupScreen/useGroupFilters.ts:26`. `setRangeLimit()` (an action creator) is invoked but never `dispatch`ed → no-op; range limit stays 0. Fix or delete (duplicated in `GroupScreen.tsx:67`).
- **A5. `MainScreen` effects missing deps** — `screens/MainScreen/MainScreen.tsx:70,75,84,155`. `getAllGroups(activeSection.id)` closes over `activeSection` (not in deps) → stale ref; `daysPassed` is computed via an effect→state chain (derived-state anti-pattern) — compute in render/`useMemo`.
- **A6. `useCardFlip` has spurious `cards` dep** — `hooks/LearnCards/useCardFlip.ts:30`. `cards` is never read inside but recreates `handleFlipCard` on every swipe, cascading new `checkAnswer` and breaking memoization. Remove it.
- **A7. `useGroupNavigation` missing `activeSectionId` dep** — `hooks/GroupScreen/useGroupNavigation.ts:44`. Editing a group while switching sections updates with a stale section ID.
- **A8. `LearnCheck` uses `Math.random()` inside `useMemo`** — `components/Learn/LearnCheck/LearnCheck.tsx:32`. Impure memo can re-shuffle mid-exercise (StrictMode/concurrent). Use a lazy `useState` initializer.
- **A9. `LearnCrossWord` pushes `{ rowIndex, colIndex }` but `Coord` is `{ row, col }`** — `components/Learn/LearnCrossWord/LearnCrossWord.tsx:112`. The already-selected guard never matches → cells can't be de-selected. Also its `generateCrossword` effect has `[]` deps while reading `shownWords` (stale when cards sync).
- **A10. `ProfileScreen` duplicates theme into local state** — `screens/ProfileScreen/ProfileScreen.tsx:50`. `isThemeDark` can drift from `theme.dark`; derive directly from context.
- **A11. `useGroupModals` initializes from Redux `shownModes` once, never re-syncs** — `hooks/GroupScreen/useGroupModals.ts:25`. Stale after persist rehydration.
- **A12. `AddCardModal.updateManualCard` mutates state in place** — `components/Modals/AddCardModal/AddCardModal.tsx:449`. `[...manualCards]` is shallow; `copy[index][field] = value` mutates the original object. Use `.map(i === index ? {...card,[field]:value} : card)`.

## 🟡 Medium
- **A13. `AddCardModal` inverted import guard** — `AddCardModal.tsx:183` (and `:276`). `if (isJsonOutputExists)` fires the "No valid data" error when data *does* exist → every successful file import is rejected. Invert the check.
- **A14. `GroupModals` has a second `bottomSheetRef` never attached** — `screens/GroupScreen/components/GroupModals/GroupsModal.tsx:81`. `snapToIndex`/`close` target an unattached ref → snap logic is dead code. Pass the controlling ref down.
- **A15. `MainScreen` notification effect re-fires on every `repeatedGroupsIds` change** — `MainScreen.tsx:107`. Duplicate notifications on sync; gate with a `useRef` sent-flag.
- **A16. `CardItem` edit fields reset to `''` on save** — `components/Card/CardItem/CardItem.tsx:59`. Reopening the modal shows blank inputs; reset to submitted values or re-derive from `item`.
- **A17. `LanguageProvider` renders `null` while loading** — `contexts/LanguageProvider.tsx:51`. Blocks the whole tree (incl. PersistGate spinner) → blank screen. Render a loader or move below PersistGate.
- **A18. `ThemeProvider` value/`toggleTheme` not memoized** — `contexts/ThemeProvider.tsx:41`. New context object every render re-renders all theme consumers app-wide. `useCallback` + `useMemo` the value.
- Plus: `useLearnSession` `accuracy` dep on `.length` only (`:20`), `LearnQuiz` `generateQuizOption` effect missing deps (`:33`), `useLearnScreen` stale `sessionData` log (`:117`), several `key={index}` on lists.

## 🟢 Low
- Unused `moti` `View` import in `App.tsx:15`; several screens import `moti`'s `View`/`ScrollView` (reanimated-backed) where plain RN views suffice (`GroupScreen.tsx:2`, `LoginScreen.tsx:4`, `AddCardModal.tsx:5`); redundant `key` on `Link` inside `GroupItem.tsx:31`; `ProtectedRoute` dead double-return + missing `dispatch` dep; spurious `cards.length` dep in `useGroupFilters` `onChangeCardsRange`.

---

# 📎 Appendix B — React Performance Audit (specialist agent)

> Focused pass on re-renders, FlatList config, selector shape, persist bloat, native leaks, bundle weight. **New findings** beyond the main report.

## 🔴 Critical
- **B1. New axios instance + AsyncStorage read on every API call** — `utils/createAuthorizedInstance.ts:15`, `redux/services/withAuth.ts`, `helpers/offlineHelpers/enqueueOrDispatch.ts:63`. 3 thunks on a screen = 3 serial AsyncStorage reads (6–24 ms pure latency) + 3 throwaway axios objects. `enqueueOrDispatch` also reads the token a second time. **Fix:** one singleton instance; update the `Authorization` default header on login/rehydrate via `setAuthToken`.
- **B2. redux-persist whitelist persists `cards` + `results` (+ transient `network`)** — `redux/store.ts:52`. Every card mutation serializes the full tree (potentially base64 images) to AsyncStorage on the JS thread → jank. Persisting `network.isConnected:true` makes the app boot believing it's online. **Fix:** whitelist only `['user','languages','sections','offlineQueue','sharedGroups']`.
- **B3. `useLearnCards` reshuffles every render** — `hooks/LearnCards/useLearnCards.ts:9` (also M9). O(n log n) per render on any parent state change. Lazy `useState(() => …)`.
- **B4. `CardList` inline `renderItem`/`onRemove` defeats `memo`; `height: height/2` clips list; missing FlatList perf props** — `components/Card/CardList/CardList.tsx:56` (expands M6). Add `useCallback`, `windowSize`, `removeClippedSubviews`, `initialNumToRender`, `maxToRenderPerBatch`; drop the fixed height.
- **B5. `LearnCrossWord` renders a full N×N `Pressable` grid (no virtualization), selects whole `state.cards`, regenerates puzzle in a stale-dep effect** — `components/Learn/LearnCrossWord/LearnCrossWord.tsx:18`. ~169 native views on mount; scope the selector to `cards.map(c => c.word)`, memoize generation, virtualize rows.

## 🟠 High
- **B6. `GroupList` double-subscribes `state.groups`; `GroupItem` not memoized** — `components/Group/GroupList/GroupList.tsx:29`. Two re-renders per action; every item re-renders when one group changes. Merge selectors, `memo(GroupItem)`.
- **B7. `selectVisibleCards` recomputes filter+sort while the slice already maintains `filteredCards`** — `redux/cardReducer/cardSelector.ts` vs `cardSlice.ts:70`. Redundant O(n log n). Select `filteredCards` directly.
- **B8. `LearnCheck` re-shuffles on `learningCards` ref change; inline FlatList renderers; two FlatLists for a 4-item board** — `components/Learn/LearnCheck/LearnCheck.tsx:32`.
- **B9. `useLearnScreen` `console.log`s `sessionData` on every card interaction** — `hooks/LearnScreen/useLearnScreen.ts:112,117`. Bridges a large object each call; remove or `__DEV__`-guard.
- **B10. `CardItem` calls `useWindowDimensions()` per instance + inline size math** — `components/Card/CardItem/CardItem.tsx:47`. 50 cards = 50 dimension subscriptions. Lift sizing to parent / `useMemo`.
- **B11. `LearnQuiz` creates a new `Audio.Sound` per correct answer, never unloaded** — `components/Learn/LearnQuiz/LearnQuiz.tsx:92`. **Native memory leak.** Create once in a ref, `setPositionAsync(0)` + replay, `unloadAsync` on unmount.
- **B12. `StatisticsScreen` `Dimensions.get` + `chartConfig` rebuilt every render** — `screens/StatisticsScreen/StatisticsScreen.tsx:89`. Memoize chart config.
- **B13. `ResultsScreen` groups results via effect→state (double render) + inline `Object.entries`** — `screens/ResultsScreen/ResultsScreen.tsx:61`. Use `useMemo`.

## 🟡 Medium
- **B14. `convertDeviceImage` base64-encodes every picked image on native** — `utils/images/convertDeviceImage.ts:15`. 133–400 KB strings into Redux + persist. Keep the file URI; encode only at the API call (or use multipart upload).
- **B15. `convertBlobToBase64` never resolves** — `utils/images/convertBlobToBase64.ts:7`. Reads `reader.result` *before* `readAsDataURL`, so the `if` is always false and the Promise hangs forever. **Correctness + event-loop stall.** (Cross-listed B/C.)
- **B16. `CardSwiper` `key` changes every swipe → full Swiper remount** — `components/Learn/LearnCards/components/CardSwiper/CardSwiper.tsx:46`. Destroys/recreates 3 native card views per advance. Drop the `key`; rely on `cardIndex`.
- Plus: broad `state.groups`/`state.cards` selectors in `useGroupScreen.ts:15` and double `state.cards` subscription in `GroupScreen.tsx:38`; stale `i18n.t()` memo in `useGroupFilters.ts:32`.

## 🟢 Low / bundle
- **B17.** `sharp` (~50 MB native, no RN equivalent) and `xlsx` (~600 KB) in `dependencies` — move to `devDependencies`/remove.
- **B18.** `useCardFlip` shares one `useSharedValue` across all stacked cards — flipping one animates all.
- Lazy-load `StatisticsScreen` (chart-kit + svg ~580 KB at launch); reconsider half-activated `nativewind`; reduce `react-native-deck-swiper` `stackSize` to 2; cheaper optimistic IDs than crypto UUID v4.

---

# 📎 Appendix C — Production-Readiness / Ops Audit (specialist agent)

> **Score: 28/100 — BLOCKED.** The backend, as configured, will not boot in production. Items already in the main report are referenced, not re-derived.

## 🔴 Critical (will break in prod / supply-chain)
- **P-C1. Production DB string is `undefined` → cannot boot** — `backend/src/db/sequelize.ts:9`. The `NODE_ENV==="production"` branch reads `process.env.DATABASE_URL!`, but nothing sets it (compose passes discrete `DATABASE_*` vars instead; the `DatabaseURL.ts` builder is never imported). Any prod boot fails immediately. **The production path has never worked.**
- **P-C2. `connectDB` swallows connection errors → server proceeds against a dead DB** — `sequelize.ts:34`. Catches `authenticate()` failure, only logs, doesn't rethrow; `start()` then `sync`s and `listen`s anyway → "healthy" server that 500s on every request. Fail fast (`process.exit(1)`).
- **P-C3. Supply-chain-risky placeholder deps** — `backend/package.json`: `crypto@^1.0.1`, `fs@^0.0.1-security`, `path@^0.12.7` shadow Node built-ins (`fs@0.0.1-security` is the npm security-hold placeholder). Remove all three; use core modules.
- **P-C4. No committed backend lockfile + `npm install` (not `ci`) in Docker** — `backend/.gitignore` ignores `package-lock.json`; `Dockerfile:8` floats every dep on each build → non-reproducible/unauditable images. Commit the lockfile, switch to `npm ci`.

## 🟠 High
- **P-H1. Dockerfile pins EOL Node 14**, single-stage, ships dev deps, runs as root — `backend/Dockerfile:1`. Use `node:20-alpine` (pinned by digest), multi-stage, non-root `USER node`.
- **P-H2. `docker-compose.yaml` runs `npm run dev` (nodemon) as "prod"**, bind-mounts source, passes no `JWT_SECRET`/`NODE_ENV`/`DATABASE_URL`, no healthcheck/restart, races Postgres on boot. Run the built image (`npm start`), supply env, add `depends_on: condition: service_healthy`.
- **P-H3. No health/readiness/liveness endpoint** anywhere in `backend/src`. Add `GET /health` (process) and `GET /ready` (`SELECT 1`) so the P-C1/P-C2 "up but broken" state is detectable.
- **P-H4. No graceful shutdown, no global error middleware, no `uncaughtException`/`unhandledRejection` guards.** SIGKILL drops in-flight requests on every deploy. Capture the server, drain on SIGTERM, `sequelize.close()`, add a terminal Express error handler.
- **P-H5. Schema via `sync({alter:true})` at boot — no migrations/rollback for app tables** (Drizzle migrations cover only the read-only dictionary tables). `alter:true` can drop columns/lock tables, runs on every replica. Adopt versioned migrations as a deliberate single-runner deploy step.
- **P-H6. `validateEnvVariables` validates the wrong set** — `helpers/db/validate-env-variables.ts:4`. Requires unused `JWT_LIFETIME`, ignores the `DATABASE_URL` that actually gates prod connectivity and `UNSPLASH_KEY`. Prefer one Zod-parsed typed config.

## 🟡 Medium
- **P-M1. Logging is broken/unsafe** — `middlewares/initializeLogger.ts:15` interpolates the raw `Request` object (`[object Object]`, risks logging the `Authorization` token); no request/correlation ID; console-only; ~31 stray `console.*` bypass it.
- **P-M2. No error tracking / crash reporting** (no Sentry/OTel). Production failures are invisible.
- **P-M3. `ensureLanguages` does 19 sequential DB round-trips on every boot**, racy across replicas — move to a seed/migration step.
- **P-M4. DoS surface** — no rate limit, no explicit `express.json({limit})`, unbounded `IN(...)` in `getCardsFromIds`, in-memory pagination amplification (`getAllSharedGroups`).
- **P-M5. Destructive scripts shipped in the image** — `drizzle/scripts/reset.ts` (`TRUNCATE … CASCADE`) reachable via npm scripts against prod env. Guard with `NODE_ENV!=='production'` + `--confirm`; exclude `scripts/` from the prod image.
- **P-M6. No backup / PITR** for the Postgres volume — combined with `sync({alter})` and reset scripts, there is no recovery path. Automate `pg_dump`, test a restore.

## 🟢 Low
- Duplicate drivers/libs: `bcrypt` + `bcryptjs`, `pg` + `postgres` — pick one each.
- `helmet()` only in the unused certificated entry, not the deployed `index.ts`.
- SSL cert-path bug (`index.certificated.ts:43`) makes the HTTPS entry unusable (also H8).
- `NODE_ENV` defaults to `"localhost"` (non-standard sentinel).
- No `engines`/`.nvmrc` to pin Node; tracked `.DS_Store`/`.expo`.

**Ops fix order:** (1) wire `DATABASE_URL`/`NODE_ENV` + fail-fast `connectDB`/`start` (P-C1/P-C2); (2) add `/ready` (P-H3); (3) remove placeholder deps + commit lockfile + `npm ci` (P-C3/P-C4); (4) Node 20 multi-stage non-root image + fixed compose (P-H1/P-H2); (5) migrations replacing `sync({alter})` (P-H5).

---

*Appendices A–C produced by specialist React-pattern, React-performance, and production-readiness agents. All line references as of commit `53217ef`.*

---

# 📎 Appendix D — React Performance (ecc:react-performance skill, priority-ordered)

> Re-frames the perf findings against the skill's 8-priority catalog (`async-`/`bundle-`/`server-`/`client-`/`rerender-`/`rendering-`/`js-`/`advanced-`), adapted to React Native. Adds **new** evidence-based items (per-call waterfall, barrel imports, lazy routes) and maps everything to RN-equivalent Web Vitals.

### P1 `async-` Waterfalls (CRITICAL)
- **Every thunk is a 2-stage serial waterfall.** `redux/userReducer/userThunk.ts:44`, `resultThunk.ts:9`, `groupThunk.ts:11`, `sharedGroupThunk.ts:*` each `await createAuthorizedInstance()` (which itself awaits an AsyncStorage token read) **before** `await`-ing the request — an AsyncStorage round-trip serialized in front of every network call. Fix via the singleton instance (B1).
- Screen dispatches already fire in parallel (no `await dispatch` chains except `SharedGroupDetailsScreen.tsx:72`, which is a legit dependency). `MainScreen` `getSections → getAllGroups` is a real data dependency — leave sequential.

### P2 `bundle-` Bundle Size (CRITICAL)
- **Barrel imports** — `ProtectedRoute` imports 5 screens `from '@/screens'` (a 33-line re-export of ~30 screens); Metro's weak tree-shaking can pull the whole graph (incl. `StatisticsScreen` + `chart-kit` + `svg`, ~580 KB) into first load. Import by direct path.
- **No lazy routes** — wrap `StatisticsScreen`/`ResultDetailsScreen` in `React.lazy` (Expo 52 supports it).
- `sharp` (~50 MB native) + `xlsx` in `dependencies` → `devDependencies` (B17).

### P3–P4 `server-` / `client-`
- `server-`: N/A (no RSC).
- `client-` (MED-HIGH): hand-rolled `useEffect`+dispatch with no request dedup → the skill's "use SWR/TanStack Query for dedup" rule. At minimum lean on the existing `createAppAsyncThunk` `condition` to drop in-flight duplicates; `CardList` refetches on every `group` object-ref change.

### P5 `rerender-` (MEDIUM)
- *Subscribe to derived booleans* → whole-slice selectors in `GroupList.tsx:29`, `useGroupScreen.ts:15`; select `isLoading` / `cards.length > 0` directly.
- *Derive in render, not effect* → `ResultsScreen.tsx:61` (`groupResultsByDay`), `MainScreen.tsx:155` (`daysPassed`).
- *memo / non-primitive props* → `CardList` inline `renderItem`+`onRemove` (B4), unmemoized `GroupItem` (B6), unmemoized `ThemeProvider` value (A18).

### P6 `rendering-` (MEDIUM)
- *Virtualize long lists* → `LearnCrossWord` ~169 unvirtualized `Pressable`s (B5); FlatLists missing `windowSize`/`removeClippedSubviews`/`initialNumToRender` (B4).
- *Avoid remount* → `CardSwiper` `key` changes every swipe → full native remount (B16).
- *Ternary over `&&`* → spot-checked; `GroupFilters.tsx:223` uses a boolean comparison (safe).

### P7 `js-` (LOW-MEDIUM)
- Reshuffle (`Math.random` sort) every render — `useLearnCards.ts:9` (B3); crypto UUID v4 for client-only optimistic IDs (B18); base64 image encode in the interaction path (B14); **`convertBlobToBase64` hangs forever** — reads `reader.result` before `readAsDataURL` (B15).

### P8 `advanced-`
- Event-handler ref / `useLatest` for a stable `onRemove` is the clean way to restore `memo(CardItem)` without recreating the callback each render.

### RN-equivalent Web Vitals mapping
| Symptom | Driving categories |
|---|---|
| Slow screen-to-interactive | `async-` (per-call AsyncStorage waterfall), `bundle-` (barrels + chart libs at launch) |
| Janky swipes/interactions | `rerender-` (whole-slice selectors, broken memo), `rendering-` (CardSwiper remount, unvirtualized grid) |
| Cold-start jank | `bundle-` (no lazy routes), persist serialization of `cards`/`results` (B2) |
| Main-thread stalls | `js-` (reshuffle, base64, `convertBlobToBase64` hang) |

**Highest-leverage perf fixes:** (1) singleton axios instance — kills the `async-` waterfall on every request; (2) trim the redux-persist whitelist (B2); (3) direct/lazy screen imports — cuts first-load JS; (4) fix `CardList` memo + FlatList props.

*Appendix D adapted from the ecc:react-performance skill (Vercel Labs `react-best-practices`, MIT). Line refs as of commit `53217ef`.*

---

# 📎 Appendix E — Frontend Patterns (ecc:frontend-patterns skill)

> Architecture/pattern lens: composition, reusable hooks, state-management structure, forms/validation, error boundaries, a11y. Findings verified by grep against `frontend/src`.

### 🔴 No Error Boundary anywhere
`grep` for `ErrorBoundary`/`componentDidCatch`/`getDerivedStateFromError` → **none**. A render throw in any screen (latent ones exist: `addCard` field access, `LearnCrossWord` coord bug A9, hung `convertBlobToBase64` B15) white-screens the whole app with no recovery. **Fix:** add the skill's `ErrorBoundary` (RN fallback + reset) around the navigator in `App.tsx`, plus per-screen boundaries around the Learn modes.

### 🟠 No debounce on live-filtering inputs
`grep` "NO DEBOUNCE". `SearchInput` fires `onChange` per keystroke; `ChooseLanguageScreen` + `GroupFilters` filter synchronously each character. **Fix:** add the skill's `useDebounce(value, 300)` and filter off the debounced value.

### 🟠 Validation is ad-hoc and disagrees with the backend
`utils/form-validation.tsx`: `isValidPassword = len >= 6`, but backend `User` model validates `password` `len: [4,30]` and email via Sequelize `isEmail` — client blocks 4–5 char passwords the server accepts; two email checks can diverge. **Fix:** one Zod schema as source of truth for client validation (and shared types); align the length rule.

### 🟡 20 `useState(false)` modal toggles — missing `useToggle`
Open/close booleans re-declared across `CardItem`, `GroupActions`, `GroupModals`, `ProfileScreen`, etc. **Fix:** extract the skill's `useToggle()` hook; removes a class of "forgot to reset" bugs (A16).

### 🟡 `sessionData` sprawl — a `useReducer`/Context+Reducer case
Learn-session state is spread across `useLearnScreen`/`useLearnSession`/`useLearnCards` with `{...prev,[key]:...}` spreads that drive the memo churn in Appendix B. **Fix:** model the session as one reducer (`ANSWER_CARD`/`NEXT_CARD`/`RESET`) for atomic, predictable transitions.

### 🟡 Modals: not accessible, don't compose
`DefaultModal` close control is `<Icon name="times" onPress=…>` — not a button, no `accessibilityRole`/`accessibilityLabel`/44px target/`accessibilityViewIsModal`/focus management. `ExitModal`, `AddCardModal`, `GroupsModal` re-implement modal chrome instead of composing `DefaultModal`. **Fix:** labeled `Pressable` close (role=button, hitSlop), `accessibilityViewIsModal` on content; route other modals through `DefaultModal` as the composition root.

### 🟢 Leaky contracts / fetch duplication
- `SearchInput` `onChange: Dispatch<SetStateAction<string>>` couples it to a `useState` setter — type as `(value: string) => void`.
- Every list screen hand-wires `dispatch + selector + isLoading`. A thin `useThunkQuery(thunk, selector)` over the existing `condition`-gated thunks (RN-appropriate stand-in for SWR/React Query) would remove the boilerplate and the duplicate-fetch/effect-dep bugs (M6/B4).

*Appendix E adapted from the ecc:frontend-patterns skill. Line refs as of commit `53217ef`.*
