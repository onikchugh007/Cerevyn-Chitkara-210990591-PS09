# Cerevyn-Chitkara-2310990591-PS09
## MEMEMIND: Adaptive Memory Matching Game with Deterministic PRNG Seeds & Cognitive Calibration

---

## 🎓 Candidate & Placement Submission Metadata

| Attribute | Submission Detail |
| :--- | :--- |
| **Candidate Name** | **Onik Chugh** |
| **University Roll Number** | **2310990591** |
| **Academic Branch** | **Computer Science and Engineering (CSE)** |
| **Institution** | **Chitkara University** |
| **Problem Statement ID** | **Problem Statement 09 (PS09)** |
| **Project Title** | Adaptive Memory Matching Game (Synapse Engine / MEMEMIND) |
| **Repository Name** | `Cerevyn-Chitkara-210990591-PS09` |
| **Evaluated Release Tag** | `v1.0.0` |
| **Evaluated Commit Hash** | `862d359` |

---

## 1. Problem Statement

Memory matching games traditionally rely on static, nondeterministic card layouts with fixed difficulty levels and opaque reset behaviors. **Problem Statement 09 (PS09)** requires engineering an adaptive, full-stack memory matching web application that:
1. **Starts with a 4×4 grid** (8 pairs) as the standard baseline.
2. **Generates deterministic card distributions** using reproducible random seeds, ensuring that entering the same seed string yields the exact same card positions.
3. **Enforces strict input concurrency invariants**:
   - Prevents a 3rd card selection while two unmatched cards are resolving.
   - Ignores repeat clicks on an already revealed card without penalty.
   - Ignores clicks on already matched pairs without penalty.
4. **Tracks high-precision gameplay telemetry**:
   - Moves count (incremented strictly when a pair attempt is completed).
   - Pairs matched count.
   - Active elapsed time (pausing when browser tabs blur or minimize).
5. **Calibrates difficulty adaptively**:
   - Calculates cognitive efficiency: $\text{Efficiency} = \left(\frac{\text{Theoretical Minimum}}{\text{Actual Moves}}\right) \times 100\%$.
   - Transparently triggers level promotions (escalating to 6×6, 18 pairs) or demotions (stepping down to 3×4, 6 pairs).
   - Explains the mathematical rationale for every adaptation decision.
6. **Guarantees zero ghost flips on restart**:
   - Cancels pending mismatch resolution timers immediately upon restart.
7. **Operates entirely self-contained**:
   - Free of paid APIs, telephone calls, or live WhatsApp services.

---

## 2. Technical Approach & Architecture

### Full-Stack Architecture
- **Backend Tier (Node.js & Express)**:
  - `server/server.js`: HTTP entry point and graceful shutdown lifecycle management.
  - `server/app.js`: Express middleware stack (CORS, JSON parsers, static cache-control).
  - `server/routes/api.js`: REST API endpoints for board generation, session submission, telemetry, and rules documentation.
  - `server/services/seedEngine.js`: Deterministic Mulberry32 PRNG and Fisher-Yates array shuffling.
  - `server/services/adaptiveEngine.js`: Rule engine calculating cognitive efficiency and explainable adaptation decisions.
  - `server/services/sessionStore.js`: Thread-safe session persistence with in-memory ring buffer (latest 200 sessions) and asynchronous disk sync to `server/data/sessions.json`.
- **Frontend Tier (Vanilla HTML5, CSS3, ES6+ JavaScript)**:
  - `public/index.html`: Semantic arcade cabinet interface, live scoreboard, and interactive modals.
  - `public/css/style.css`: Custom cyber-arcade visual theme with 3D CSS card-flip transforms, holographic borders, and responsive grid layouts.
  - `public/js/game.js`: Client controller managing card selection invariants, timing, telemetry, and continuous progression.
  - `public/js/audio.js`: Zero-asset procedural sound synthesizer using the native HTML5 Web Audio API (sine, triangle, and sawtooth waves).
  - `public/js/seedClient.js`: Client-side deterministic board generator and offline evaluation fallback.

### Concurrency & State Machine Invariants
```
                      [ Idle / Board Ready ]
                                │
                        (First Card Click)
                                ▼
                       [ Card 1 Revealed ]
                                │
                        (Second Card Click)
                                ▼
                      [ Move Counted: +1 ]
                                │
              ┌─────────────────┴─────────────────┐
              ▼                                   ▼
        [ Pair Matches ]                  [ Mismatch Detected ]
              │                                   │
      (Golden Shimmer)                   (Lock 3rd Clicks: isResolving = true)
      (Pairs Matched: +1)                (Play Wah-Wah Sound)
      (Show Match Popup)                 (Start 900ms Tracked Timeout)
              │                                   │
              │                           ┌───────┴───────┐
              │                           ▼               ▼
              │                     (Timeout Ends)   (User Restarts Mid-Timer)
              │                           │               │
              │                     (Flip Back)      (clearTimeout())
              │                     (Unlock Inputs)  (Abort Ghost Flip)
              │                           │               │
              └───────────────────┬───────┘               ▼
                                  │             [ Clean State Reset ]
                                  ▼
                         [ Check Win State ]
                                  │
                 ┌────────────────┴────────────────┐
                 ▼                                 ▼
           (Pairs < Total)                  (Pairs == Total)
                 │                                 │
           [ Keep Playing ]                        ▼
                                          [ Win Celebration ]
                                          [ Submit Telemetry ]
                                          [ Auto-Escalate to Level 2 ]
```

---

## 3. Dependency Manifest & Version Specifications

### Production Dependencies
| Package | Version | Purpose |
| :--- | :--- | :--- |
| **`express`** | `^5.3.0` | High-throughput HTTP routing, static asset delivery, and REST API controller |
| **`cors`** | `^2.8.6` | Cross-Origin Resource Sharing middleware for client-server decoupling |
| **`sharp`** | `^0.35.5` | High-performance image processing for local meme asset optimization |

### Development & Testing Dependencies
| Package | Version | Purpose |
| :--- | :--- | :--- |
| **`jest`** | `^30.5.2` | Automated unit and integration testing framework |
| **`supertest`** | `^7.3.1` | HTTP integration assertions against Express endpoints without binding real sockets |

---

## 4. Setup, Run & Test Instructions

### Step 1: Clone the Repository
```bash
git clone https://github.com/onikchugh007/Cerevyn-Chitkara-210990591-PS09.git
cd Cerevyn-Chitkara-210990591-PS09
```

### Step 2: Environment Configuration
Copy the credential-free configuration template:
```bash
cp .env.example .env
```
*(No API keys or cloud credentials are required; the application runs out of the box with default ports).*

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Run Automated Tests
```bash
npm test
```

### Step 5: Start Local Server
```bash
npm start
```
The application will launch on port 3000:
```
====================================================
🚀 Synapse Adaptive Memory Game Server
📡 Listening on http://localhost:3000
🌐 Environment: development
====================================================
```
Open your web browser at: **`http://localhost:3000`**

---

## 5. Complete Local Test Output (Verbatim)

Below is the complete local test suite output recorded for academic review when a hosted runner is unavailable:

```
> mememind@1.0.0 test
> jest --runInBand --detectOpenHandles

PASS server/tests/api.test.js
  PS09 Memory Game API Integration Tests
    √ GET /api/health returns 200 and healthy status (24 ms)
    √ GET /api/game/new generates a valid default 4x4 board with 8 pairs (18 ms)
    √ GET /api/game/new is deterministic for identical seeds (14 ms)
    √ GET /api/game/new rejects invalid difficulty parameter with 400 (10 ms)
    √ POST /api/game/session records session and returns explainable promotion (26 ms)
    √ POST /api/game/session returns demotion explanation for high moves and latency (15 ms)
    √ POST /api/game/session rejects requests missing required metrics with 400 (9 ms)
    √ GET /api/game/analytics returns aggregate telemetry and session history (12 ms)
    √ GET /api/game/rules returns documented adaptation matrix schema (8 ms)

PASS server/tests/adaptiveEngine.test.js
  AdaptiveEngine - Cognitive Metrics & Explainable Rules
    √ calculateMetrics accurately computes cognitive efficiency and ratios (4 ms)
    √ evaluateSession promotes Standard to Advanced under high performance threshold (3 ms)
    √ evaluateSession demotes Standard to Novice under cognitive fatigue threshold (2 ms)
    √ evaluateSession maintains Standard within baseline moves and time window (2 ms)
    √ evaluateSession promotes Novice to Standard when tutorial thresholds are met (2 ms)
    √ evaluateSession steps down Advanced to Standard under high matrix fatigue (2 ms)

PASS server/tests/seedEngine.test.js
  SeedEngine - PRNG Determinism & Board Generation
    √ Mulberry32 PRNG produces identical sequence for identical seeds (3 ms)
    √ Mulberry32 PRNG produces different sequences for different seeds (2 ms)
    √ generateBoard generates exactly 8 unique pairs (16 cards) for standard difficulty (4 ms)
    √ generateBoard generates 6 pairs for novice and 18 pairs for advanced (5 ms)
    √ generateBoard assigns valid pairIds and identical meme images for pairs (3 ms)

Test Suites: 3 passed, 3 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        3.539 s
Ran all test suites.
```

---

## 6. Sample Data & Test Scenarios

The repository includes a dedicated `sample_data/` directory providing documented JSON request/response fixtures across 6 scenarios:

| Scenario File | Scenario Description | Expected Outcome |
| :--- | :--- | :--- |
| [`sample_data/01_board_generation_standard.json`](./sample_data/01_board_generation_standard.json) | Normal Board Generation (Seed `DOGE-01`, Standard) | 200 OK; 16 cards, 8 unique pairs, 4×4 grid |
| [`sample_data/02_session_promotion_gigachad.json`](./sample_data/02_session_promotion_gigachad.json) | High Performance Promotion (`Moves <= 14`, `Time <= 35s`) | 201 Created; Action `PROMOTE`, Next: `advanced` (6×6 Matrix) |
| [`sample_data/03_session_demotion_fatigue.json`](./sample_data/03_session_demotion_fatigue.json) | Cognitive Fatigue Demotion (`Moves >= 22` or `Time >= 65s`) | 201 Created; Action `DEMOTE`, Next: `novice` (3×4 Grid) |
| [`sample_data/04_session_maintain_baseline.json`](./sample_data/04_session_maintain_baseline.json) | Baseline Performance Retention (`15-21 moves`, `36-64s`) | 201 Created; Action `MAINTAIN`, Next: `standard` |
| [`sample_data/05_session_invalid_failure.json`](./sample_data/05_session_invalid_failure.json) | Failure Case: Missing Required Metrics Payload | 400 Bad Request; Descriptive error message |
| [`sample_data/06_telemetry_analytics.json`](./sample_data/06_telemetry_analytics.json) | Aggregate Telemetry Query | 200 OK; Total rounds, average moves, average time |

---

## 7. Cognitive Calibration Rules & Mathematical Formulas

$$\text{Cognitive Efficiency (\%)} = \left( \frac{\text{Theoretical Minimum Moves}}{\text{Actual Moves Recorded}} \right) \times 100$$
*(Theoretical minimum moves = Number of Pairs in the active grid)*

### Progression Decision Matrix
```
       [ Novice: 3×4 (6 Pairs) ]
              ▲          │
              │          │ Moves <= 10 & Time <= 25s
 Moves >= 22  │          ▼
 or Time >=65s│   [ Standard: 4×4 (8 Pairs) ]  <-- Default Starting Mode
              │          ▲          │
              │          │          │ Moves <= 14 & Time <= 35s
              │          │          ▼
              │   [ Advanced: 6×6 (18 Pairs) ]
              └──────────┘
```

- **Standard $\rightarrow$ Advanced (Gigachad Promotion)**:
  - **Condition**: $\text{Moves} \le 14$ ($\text{Efficiency} \ge 57\%$) **AND** $\text{Time} \le 35\text{s}$.
  - **Rationale**: Demonstrates rapid visual search and superior short-term working memory retention.
- **Standard $\rightarrow$ Novice (NPC Tutorial Demotion)**:
  - **Condition**: $\text{Moves} \ge 22$ ($\text{Efficiency} \le 36\%$) **OR** $\text{Time} \ge 65\text{s}$.
  - **Rationale**: Search latency indicates working memory saturation; grid scales down to 3×4 to recover baseline recall.
- **Standard $\rightarrow$ Standard (Maintain)**:
  - **Condition**: 15–21 moves and 36–64s.

---

## 8. Short Demonstration Walkthrough

Reviewers can verify all functional requirements in under 3 minutes:

1. **Deterministic Reproducibility Check**:
   - In the lower control deck, enter seed **`DOGE-01`** and press Enter.
   - Note the locations of cards (e.g. Doge at top-left, Distracted BF at bottom-right).
   - Refresh the page or click the **🔴 Home** button: cards will regenerate in the exact same positions.
2. **Third-Card Lockout Check**:
   - Flip two unmatched cards.
   - Rapidly click a 3rd card during the 900ms mismatch flip-back window.
   - **Result**: The 3rd card is rejected with a bonk sound, moves are not incremented, and inputs remain locked until cards 1 and 2 flip back.
3. **Safe Restart Check (Zero Ghost Flips)**:
   - Click one card, click an unmatched card, and immediately press **🔴 Home**.
   - **Result**: The pending timer is canceled via `clearTimeout()`, resetting to 0 moves and 0 pairs without any phantom flips in the new game.
4. **Match Celebration & Continuous Escalation Check**:
   - Match a pair: an animated celebration card appears with the meme photo and caption.
   - Complete all 8 pairs on Level 1: a cinematic level-cleared overlay counts down from 3 seconds and automatically escalates into Level 2 (6×6 Matrix, 18 pairs).
5. **Interactive Modals**:
   - 🔴 **Home**: Safe restart with zero state leakage.
   - 🟡 **Sound**: Procedural audio volume toggle (saved to `localStorage`).
   - 🔵 **Peek**: 3-second preview of all cards.
   - 🟣 **Memes (🖼️)**: Gallery of all 22 locally hosted meme cards.
   - 🔵 **Rules (📜)**: Mathematical calibration thresholds table.
   - 🟢 **Telemetry (📊)**: Anonymous session metrics fetched live from `/api/game/analytics`.

---

## 9. Known Limitations

1. **In-Memory & Single-Node Storage**: Session records are persisted to local JSON (`server/data/sessions.json`) with an in-memory ring buffer. For high-concurrency multi-region deployments, migration to a distributed database (e.g., Azure Cosmos DB) is recommended.
2. **Autoplay Audio Policy**: Modern web browsers block programmatic audio until the user interacts with the page (first click). Web Audio synthesis is initialized gracefully on the first user interaction.

---

## 10. Academic Contributions & AI Assistance Statement

- **Candidate's Own Contribution**:
  - Full-stack system architecture, PRNG seed algorithm implementation, concurrency lock state machine, adaptive threshold calculations, Web Audio synthesizer, Docker configuration, and complete Jest/Supertest automated test suites.
- **Reused Assets & Public Data**:
  - 22 public internet meme photographs stored locally in `public/images/memes/`.
  - Open-source Google Fonts (Outfit, JetBrains Mono).
- **AI Assistance**:
  - Antigravity AI was used as an interactive pair-programming tool during development for code auditing, CSS layout refinement, and test scaffolding.

---

## 11. Azure Cloud Plan & CI/CD Links

- **Azure Hosting Plan**: Detailed architecture diagrams, compute/storage choices, security/secrets management, and cost-control assumptions are documented in [`docs/azure-plan.md`](./docs/azure-plan.md).
- **GitHub Actions Workflow**: The continuous integration pipeline is defined in [`.github/workflows/ci.yml`](./.github/workflows/ci.yml).
- **Docker Containerization**: Multi-stage `Dockerfile` with non-root security context and integrated health check.
