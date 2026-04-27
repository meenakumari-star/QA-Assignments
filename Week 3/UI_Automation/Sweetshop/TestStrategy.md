
# Test Strategy

## 1. Introduction

### 1.1 Purpose
Highest-level QA artifact for the engagement. Sets direction for all subordinate documents (Test Plan, Scenarios, Cases, RTM, Bug Reports, Execution Report). Describes what we will test, why, how, who is involved, what tools we use, and what entry/exit criteria define done.

### 1.2 Scope of this Document
Stable across the engagement. Covers product under test and quality risks, test scope (in and out), testing types and levels, test design techniques, tools, environments, data approach, defect management, entry/exit criteria, risks, deliverables, reporting cadence.

### 1.3 Intended Audience
- QA Engineers (derive plan + cases from this)
- Developers (understand expected coverage and defect handling)
- Project Lead (validate approach is risk-based and aligned with spec)

### 1.4 Reference Documents
- Sweet Shop Product Specification v2.0
- Internal QA training material (QA Excellence, API Testing Concepts, Automation Testing)

---

## 2. Product Overview & Quality Risk Snapshot

### 2.1 Product Summary
Five-page client-side e-commerce app for retro confectionery. No real backend — auth, payment, and order placement simulated. Intentionally constructed with defects for DevTools exploration. Test approach must be exploratory enough to surface unspecified defects while structured enough to verify documented behaviour.

### 2.2 Application Footprint
| Page           | URL       | Primary Functions                                                        |
|:--------------|:-----------|:--------------------------------------------------------------------------|
| **Home**         | /         | Hero banner, promo banner, Most Popular (4 products), Browse Sweets CTA  |
| **Browse Sweets**| /sweets   | Full catalogue (16 items), Add to Basket on each card                   |
| **Basket**       | /basket   | Basket review, delivery, promo, billing form, payment form, checkout     |
| **Login**        | /login    | Email + password (no real auth), social icons (non-functional)           |
| **About**        | /about    | Project description and promotional banner                               |

### 2.3 Top Quality Risks
| #   | Risk Area                          | Why it matters                                                      |
|:----|:-----------------------------------|:--------------------------------------------------------------------|
| R1  | Price calculation accuracy         | Floating-point bugs common in JS carts; affects what user pays      |
| R2  | Basket state persistence           | Spec leaves persistence across refresh/tab/session as TBD           |
| R3  | Form validation completeness       | Multiple forms with multiple required fields                        |
| R4  | Add to Basket counter accuracy     | Visible in navbar; miscount erodes trust                            |
| R5  | Promo code logic                   | Valid codes not documented; discount type must be discovered        |
| R6  | Cross-page navigation & active state | SPA-like behaviour TBD; broken /bout is known                    |
| R7  | Client-side state manipulation     | localStorage may be mutable via DevTools; UI must degrade gracefully|
| R8  | Browser compatibility              | Primarily Chrome; Firefox/Safari secondary                          |

---

## 3. Test Objectives & Quality Goals

### 3.1 Objectives
- Build confidence (demonstrate documented behaviour works)
- Detect defects early
- Verify requirements (every FR/NFR traced via RTM)
- Validate user needs (browse → basket → checkout end-to-end)
- Measure quality (coverage, defect density, defect escape rate at exit)
- Reduce risk (probe security, persistence, calculation areas)

### 3.2 Quality Goals
| Goal                                   | Target                                   |
|:-------------------------------------- |:-------------------------------------------|
| Requirements coverage                  | 100% of FR-01..18 and NFR-01..08                                   |
| P0 critical flow pass rate             | 100% (no P0 may remain failing at exit)                                    |
| P1 critical flow pass rate             | ≥ 95%                                      |
| Open Critical / High defects at exit   | 0                                        |
| Lighthouse performance score           | ≥ 70 on Home and Browse Sweets            |
| Add-to-Basket/counter update latency   | < 100 ms                                       |
| Page load (Home)                       | < 3 seconds on standard broadband                                |

---

## 4. Scope of Testing

### 4.1 In Scope
- All five pages
- Functional, UI/visual, form validation, negative/edge cases
- State management, price calculation verification
- Cross-browser smoke, performance spot-checks
- UI-level security checks, accessibility spot-checks
- Automation of P0 + P1 critical flows in Playwright

### 4.2 Out of Scope
- API/backend testing (no real backend)
- Real payment processing
- Server-side validation
- Order confirmation/emails
- User registration/account
- Search/filter/sort, multi-currency
- Full WCAG audit, mobile-responsive optimisation
- Load/stress testing

**Note on API testing:**
Training covers REST API testing, but Sweet Shop is fully client-side. Documented expectation is zero network requests on add-to-basket and checkout. We verify that via Network tab as a security/integrity check, but there is no API surface to write a Postman collection against.

---

## 5. Test Approach

### 5.1 Testing Levels Applied
Pyramid is intentionally inverted vs greenfield because we have a deployed third-party app, no source code instrumentation:

| Level         | Applicability        | How we apply       it                                     |
|:--------------|:---------------------|:---------------------------------------------------|
| Unit          | Not applicable       | No source-code access                                 |
| Integration   | Limited              | No backend services; verify cross-page state indirectly 
| System        | Primary focus        | Manual + automated end-to-end of all 5 pages           |
| Acceptance    | Performed against spec| Validate every FR-xx and NFR-xx via the RTM             |

### 5.2 Testing Types
- Smoke
- Sanity
- Regression
- End-to-End
- UI/Visual
- Exploratory
- Compatibility
- Performance
- Security (UI)
- Usability
- Accessibility

### 5.3 Test Design Techniques
- **Equivalence Partitioning** — email field, CVV
- **Boundary Value Analysis** — quantity (0,1,many), card length (12/13/19/20)
- **Decision Table** — Total = Subtotal − Discount + Delivery combinations
- **Negative Testing** — every form: empty/malformed/partial
- **State Transition** — basket lifecycle, delivery toggle
- **Exploratory Charters** — 30-min per-page sessions

---

## 6. Test Environment, Tools & Data

**Environment:** sweetshop.netlify.app (Netlify HTTPS); no backend; client-side only. 
- Primary: Chrome latest
- Secondary: Firefox + Safari latest
- DevTools panels: Console, Network, Application (Storage), Elements, Sources, Lighthouse

**Tooling:**
- **Manual:** Chrome DevTools, spreadsheet-based test case repo, Jira (or equivalent) bug tracker
- **Automation:** Playwright + TypeScript, Page Object Model, locator priority getByRole > getByLabel > getByText > getByTestId > CSS > XPath, HTML reporter + JUnit XML, CI on PR (smoke) + merge (full P0+P1) + nightly (full regression)

**Test Data:**
Synthetic input data driven by test case. Fixtures file alongside automation. Sets include:
- Valid/invalid emails, postcodes
- Luhn-passing/failing card numbers
- Expired dates, CVVs
- Promo codes (TBD valid + invalid)
- Product mixes, XSS payloads

---

## 7. Test Deliverables

| # | Deliverable                         | Stage      |
|---|-------------------------------------|------------|
| 1 | Test Strategy (this document)       | Strategy   |
| 2 | Test Plan                           | Planning   |
| 3 | Test Scenarios                      | Design     |
| 4 | Test Cases (manual)                 | Design     |
| 5 | Test Data fixtures                  | Design     |
| 6 | Requirements Traceability Matrix    | Design     |
| 7 | Automation Suite (Playwright POM)   | Execution  |
| 8 | Bug Reports (per defect)            | Execution  |
| 9 | Test Execution Report               | Closure    |
|10 | Test Coverage Summary               | Closure    |

### 7.2 Test Case Quality Standard (8 points)
- Clear preconditions
- Single, unambiguous expected result
- Atomic and independent
- Reproducible
- Exact test data
- Traces to requirement via RTM
- Covers negative path where applicable
- Maintainable

---

## 8. Defect Management

**Workflow:** New → Assigned → In Progress → Fixed → Ready for Retest → Closed (or Reopened)

**Bug Report — 8 required elements:**
- Descriptive title
- Steps to reproduce
- Expected vs actual
- Environment
- Evidence
- Severity
- Priority
- Reproducibility

**Severity:**
- Critical (blocked, no workaround)
- High (major broken, workaround exists)
- Medium (minor, usability impact)
- Low (cosmetic)

**Priority:**
- P1 (fix now, block exit)
- P2 (fix this cycle)
- P3 (fix soon)
- P4 (backlog)

---

## 9. Entry & Exit Criteria

**Entry:**
- Spec reviewed
- Environment accessible
- Cases authored + peer-reviewed
- RTM ≥ 90% populated
- Data fixtures prepared
- Automation framework set up
- Smoke test green

**Exit:**
- 100% P0 cases passed
- ≥ 95% P1 passed
- Zero open Critical/High
- All Medium fixed or accepted with sign-off
- Automation P0+P1 green
- RTM 100%
- Report delivered
- Intentional defects (Spec §17) documented in report

---

## 10. Risks, Assumptions & Mitigation

**Project Risks:**
- Demo URL outage (capture HAR offline)
- Undocumented promo codes (1-hour Sources investigation)
- Intentional defects confused as real (maintain known-issues register)
- No data-testid on DOM (use semantic locators)
- Spec TBDs (drive each to confirmed answer)
- No real backend (out of scope, document non-applicability)

**Assumptions:**
- URL stable
- Spec is source of truth
- Latest-stable browsers only
- Intentional defects out of scope for raising

---

## 11. Roles & Responsibilities

- **QA Engineer:** Author all artifacts, build/maintain automation, execute, raise/retest defects, produce execution report
- **Developer:** Triage and fix defects, provide build context, respond to clarifying questions
- **Project Lead:** Approve strategy + plan, sign off on exit, arbitrate severity/priority disagreements

---

## 12. Test Phases & Reporting

**8-phase QA lifecycle:**
Requirements Analysis → Test Planning → Test Design → Shift-Left → Functional Testing → Non-Functional Testing → Integration Testing → Deployment & Docs Verify

**Reporting:**
- Daily status updates (cases run/pass/fail/blocked, defects raised)
- Per-defect real-time entry
- End-of-cycle Test Execution Report

---

## 13. Automation Strategy

**Automate:**
- Smoke suite (5 min on every PR)
- All P0 + P1 critical flows
- Price calculation table (data-driven)
- Form validation negatives
- Cross-browser smoke

**Do not automate:**
- One-off exploratory
- Visual aesthetics without assertion
- Intentional-defect dependent tests
- DevTools storage manipulation
- Lighthouse audits

**Architecture:**
- Playwright + TypeScript
- Page Object Model (one class per page)
- Locator priority above
- External fixtures
- HTML reporter with traces/screenshots/video

**CI/CD:**
- Smoke on PR
- P0+P1 on merge
- Full regression nightly

**Flakiness:**
- Re-run failed test once; if flake confirmed, tag @flaky, log to register, fix root cause same sprint
- Treat test code like production code

---

## 14. Approval & Sign-Off

Sign-off authorises proceeding to Test Planning phase.

**Roles:**
- QA Engineer (Author)
- Project Lead/Reviewer
- Stakeholder