# Test Plan

## 1. Introduction

### 1.1 Purpose
Tactical companion to the Test Strategy. Where Strategy defines approach, Plan defines its execution: what gets tested in which cycle, by whom, on which day, with which build, against which exit gate.

### 1.2 Plan Scope
A single QA cycle for Sweet Shop, structured as three test sub-cycles (Smoke → Functional → Regression) over a 5-week elapsed window.

---

## 2. Product Under Test

### 2.1 Build Identification
- **URL:** sweetshop.netlify.app
- **Hosting:** Netlify (HTTPS)
- **Build:** Latest deployed Netlify build at start of cycle
- **Backend:** None
- **Storage:** localStorage and/or sessionStorage (TBD)
- **Spec:** v2.0

### 2.2 Feature Surface
- Navigation
- Product Browsing
- Basket Management
- Delivery & Promo
- Billing Form
- Payment Form
- Checkout Submission
- Authentication
- About Page
- Calculation Engine
- State Persistence
- DevTools-Visible Behaviour

---

## 3. Cycle Scope

### 3.1 In Scope
- All 18 FRs + 17 critical flows from Spec §10.1 (P0 through P3)
- All form validations from Spec §7
- All error states & negative flows from Spec §8 (§8.1 through §8.11)
- All sample calculation cases from Spec §6.4 plus rounding edge cases
- Compatibility (Chrome full + Firefox/Safari smoke)
- Performance (Lighthouse + Network timings + Slow 3G)
- Security (UI XSS, password masking, HTTPS, zero-network verification)
- Accessibility spot-checks (NFR-06 to NFR-08)
- Smoke automation, P0+P1 automation, calculation matrix data-driven, validation negatives parameterised

### 3.2 Out of Scope (this cycle)
- Mobile responsive layout
- IE/Edge Legacy
- Penetration testing beyond UI XSS
- Load/stress beyond single Lighthouse
- Localisation/i18n
- Automation of intentional defects (Spec §17)

---

## 4. Test Approach

### 4.1 Test Sub-Cycles
| Sub-Cycle   | Intent                                   | Duration         | Pass Bar                        |
|-------------|------------------------------------------|------------------|---------------------------------|
| Smoke       | Confirm build is testable                | 0.5 day          | 100% smoke pass                 |
| Functional  | Execute all functional + form validation; first automation run | 10 working days | ≥ 95% executed; ≤ 2 open Critical |
| Regression  | Re-run impacted suites after fixes; non-functional sweeps; final exit gate | 5 working days | Exit criteria met                |

### 4.2 Test Levels (this cycle)
Unit 0% · Integration 5% · System 70% · Acceptance 15% · Non-functional 10%.

### 4.3 Test Design Techniques (concrete application)
- **Equivalence Partitioning:** email, CVV, card length
- **Boundary Value Analysis:** 12/13/19/20-digit card; 0,1,16,17 items
- **Decision Table:** 8 rules from {empty/non-empty} × {Collect/Standard} × {valid promo/invalid/none}
- **State Transition:** basket lifecycle, delivery toggle
- **Error Guessing:** 0.10 + 0.20 = 0.30000000000000004; double-click Add; refresh during interaction
- **Exploratory Charters:** 30-min per page

---

## 5. Schedule

### 5.1 Cycle Calendar (5 weeks)
| Week | Phase         | Activity                                                      | Deliverable                        |
|------|---------------|---------------------------------------------------------------|------------------------------------|
| W1   | Planning      | Spec review, Q&A list, Plan, environment access               | Plan signed off; Q list to product |
| W2   | Design        | Author scenarios, cases, RTM, fixtures; build automation skeleton | Cases reviewed; RTM populated; smoke automated |
| W3   | Functional 1  | Smoke; manual P0+P1 on Chrome; raise defects                  | First execution log; first defects |
| W4   | Functional 2  | Manual P2+P3; non-functional sweeps; cross-browser smoke; expand automation | Functional pass complete; auto suite green |
| W5   | Regression    | Re-test fixed defects; full regression; final automation run; exit assessment | Exit decision; final report        |

### 5.2 Daily Cadence
09:30 standup · 09:45–13:00 execution block 1 · 14:00–16:30 execution block 2 · 16:30–17:00 defect triage · 17:00–17:30 status update.

### 5.3 Milestones
- M1 Plan signed off (W1)
- M2 Cases + RTM ready (W2)
- M3 Smoke automated green (W2)
- M4 Functional sub-cycle complete (W4)
- M5 Automation P0+P1 green (W4)
- M6 Exit assessment (W5)
- M7 Test Execution Report delivered (W5)

---

## 6. Resources

### 6.1 Team
| Role                      | Headcount | Allocation                |
|---------------------------|-----------|---------------------------|
| QA Engineer (Lead)        | 1         | 100%                      |
| QA Engineer (Manual+Auto) | 1         | 100%                      |
| Developer (PoC)           | 1 (shared)| Triage + fixes only       |
| Project Lead / Reviewer   | 1 (shared)| Review checkpoints        |

### 6.4 Effort & Capacity (~35 PD across 2 QAs over 5 weeks)
- Spec review 1.5
- Plan/Strategy maintenance 1.0
- Cases authoring 5.0
- RTM build 1.5
- Test data 0.5
- Auto framework scaffold 3.0
- Smoke + P0/P1 auto 5.0
- Manual P0+P1 5.0
- Manual P2+P3 3.0
- Non-functional sweeps 2.0
- Defect raising/retesting 3.0
- Regression 3.0
- Closure 1.5

---

## 7. Test Data & Environment Preparation

**Test Data:**
20 named data sets in fixtures (TD-EMAIL-VALID, TD-EMAIL-INVALID, TD-NAME-VALID, TD-NAME-EDGE, TD-ADDRESS-VALID, TD-POSTCODE-UK-VALID, TD-POSTCODE-INVALID, TD-CITY, TD-CARD-VALID-LUHN, TD-CARD-INVALID, TD-EXPIRY-VALID, TD-EXPIRY-EXPIRED, TD-CVV-VALID, TD-CVV-INVALID, TD-PROMO-INVALID, TD-PROMO-VALID-TBD, TD-XSS-PAYLOAD, TD-PRODUCT-MIX-A/B/C).

**Environment Prep Checklist (before W3):**
- URL reachable
- Browsers latest
- Caches/cookies cleared
- DevTools accessible
- Automation repo cloned + smoke green locally
- CI workflow configured
- Jira provisioned
- Spreadsheet repo created
- Fixtures file committed
- Known-issues register from Spec §17 captured

---

## 8. Test Execution Detail

### 8.1 Smoke Suite (10 checks)
- S1 home loads
- S2 navbar on all 5 pages
- S3 /sweets has 16 products
- S4 add-to-basket works once
- S5 /basket loads
- S6 /login loads
- S7 /about loads
- S8 Continue to checkout responds
- S9 Empty Basket clears
- S10 no critical Console errors

### 8.2 Functional Execution Order (rationale-driven)
1. Navigation & page-load (blockers first)
2. Add to Basket + counter (foundational state)
3. Basket page rendering + Empty Basket
4. Calculation engine (independent of forms)
5. Promo code (negative, then positive once code discovered)
6. Form validations — Login, Billing, Payment
7. End-to-end checkout flow
8. State persistence (cross-cutting)
9. Non-functional sweeps
10. Cross-browser smoke

### 8.3 Calculation Engine Test Matrix (12 rows)
From Spec §6.4 plus rounding probes. Examples:
- C1: Bubbly × 1, Collect → £0.10
- C2: Wham + Bubbly, Standard → £2.24
- C5: All 16 items × 1, Collect → £10.05
- C6: All 16 items × 1, Standard → £12.04
- C7: Bubbly + Drumsticks, Collect → £0.30 (rounding probe — must NOT show 0.30000…)

### 8.4 Form Validation Coverage Matrix
Each form field × {Empty, Malformed, Boundary, Valid}:
- Login: Email (4 cells), Password (3)
- Billing: First/Last Name, Email, Address 1, Country, City, ZIP, Address 2 (optional)
- Payment: Name on Card, Card Number (4 cells), Expiry (3), CVV (4)
- Promo: Code (3 cells)

### 8.5 Cross-Browser Smoke Plan
On Firefox + Safari: 10 smoke checks + 3 additions (CB-1 calculation case, CB-2 form validation, CB-3 storage inspection).

### 8.6 Performance Test Plan
- Probes: page load (<3s)
- Asset count + size
- Add to Basket response (<100ms zero-network)
- Lighthouse Performance (≥70)
- Lighthouse A11y
- Lighthouse Best Practices
- Slow 3G throttle

### 8.7 Security Probe Plan
- XSS in text fields
- XSS attribute injection
- Password masking
- Card data on the wire
- Console card data
- Mixed content
- Storage manipulation
- Direct URL access

---

## 9. Defect Management — Cycle Level

### 9.1 SLA Targets
| Severity  | Triage         | Fix         | Retest         |
|-----------|---------------|-------------|---------------|
| Critical  | Within 2 hours| Same day    | Within 4 hours |
| High      | Within 1 day  | Within 2 days| Within 1 day  |
| Medium    | Within 1 day  | Within 5 days| Within 1 day  |
| Low       | Within 2 days | Backlog OK  | When fixed     |

### 9.2 Bug Report Standard (Sweet Shop example)
- **Title:** Basket counter not updating after adding 'Sherbert Discs' from Home page
- **Steps:**
	1. Open URL
	2. Locate Most Popular section
	3. Click Add to Basket on Sherbert Discs
	4. Observe navbar count
- **Expected:** Navbar shows '1 Basket'
- **Actual:** Navbar still shows '0 Basket'
- **Environment:** Chrome 124 / Win 11 / 1920×1080 / live as of 2026-04-25 09:00 UTC
- **Evidence:** Screenshot, console log, HAR
- **Severity:** High · **Priority:** P1 · **Reproducibility:** Always (3/3)

### 9.4 Known Intentional Issues Register
- KI-1 broken /bout
- KI-2 social icons non-functional
- KI-3 city dropdown 3 cities
- KI-4 no real auth
- KI-5 no order confirmation
- KI-6 no search/filter/sort
- KI-7 general broken-by-design

---

## 10. Entry & Exit Criteria

### 10.3 Cycle Exit Criteria (10 hard gates)
- E1 100% P0 executed + passed
- E2 ≥95% P1 executed + passed
- E3 ≥80% P2 executed
- E4 zero open Critical
- E5 zero open High (or formal deferral)
- E6 all Medium fixed or formally deferred
- E7 automation P0+P1 green
- E8 100% RTM coverage
- E9 Lighthouse ≥70
- E10 Test Execution Report delivered

### 10.4 Suspension Triggers
- URL down >2h
- Critical defect blocks >30% planned cases
- >50% executed cases blocked
- Build deployed mid-cycle without agreement

---

## 11. Risks & Contingencies — Cycle Level
- OR-1 Netlify URL down (capture HAR offline)
- OR-2 promo code not discoverable (1-PD time-box, raise spec gap)
- OR-3 defect inflow exceeds dev capacity (extend cycle 1 week or cut P3)
- OR-4 automation locator drift no data-testid (centralise in POMs, tag fragile)
- OR-5 QA member unavailable (re-baseline, protect P0/P1)
- OR-6 spec TBDs unanswered (drive via exploratory)
- OR-7 build changes mid-cycle (re-baseline smoke + completed P0/P1)

---

## 12. Deliverables & Reporting

**11 deliverables:**
- Q list (W1)
- Plan (W1)
- Scenarios (W2)
- Cases (W2)
- RTM (W2)
- Fixtures (W2)
- Automation P0+P1 green (W4)
- Defect Reports (continuous)
- Daily Status (W3-W5)
- Test Execution Report (W5)
- Coverage Summary (W5)

**Daily Status Template (5 lines, 17:00):**
1. Cases run today/total/cumulative
2. New defects raised today
3. Defects retested + closed
4. Blockers/risks
5. Plan for tomorrow

---

## 13. Assumptions & Dependencies
- URL stable for cycle
- Spec is source of truth
- Latest-stable browsers
- No VPN restrictions
- Dev capacity reserved per SLAs
- Intentional defects stable across cycle
- **Dependencies:** Plan approval, Jira access, CI runner, dev triage availability, spec clarifications on TBDs

---

## 14. Approval & Sign-Off
Authorises Phase 3 (Test Design). Material changes require Plan revision and re-approval.
