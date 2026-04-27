
# Requirements Traceability Matrix (RTM)

The actual RTM is maintained in Excel (8 sheets, 161 formulas, live execution tracking). Below is an inline preview of the core sheets and their structure for reference.

---

## Sheet 1 — Cover
- Purpose
- Version
- Sheet index
- Application URL
- References

---

## Sheet 2 — RTM (Forward): Requirement → Test Cases
Live-formula sheet. Executed/Passed/Failed/Blocked counts pull from Execution Log via SUMPRODUCT.

| Req ID   | Type         | Category          | Requirement                                      | TC Count | Test Case IDs                                 | Coverage |
|:---------|:-------------|:------------------|:-------------------------------------------------|:--------:|:-----------------------------------------------|:--------:|
| FR-01    | Functional   | Product Browsing  | View all 16 products on Browse page              |    7     | TC-014..020, TC-021..026                      | Covered  |
| FR-02    | Functional   | Product Browsing  | Each product displays image/name/desc/price/button|    5     | TC-014, TC-015, TC-016, TC-017, TC-019         | Covered  |
| FR-03    | Functional   | Product Browsing  | Most Popular section of 4 products               |    4     | TC-008, TC-009, TC-010, TC-011                | Covered  |
| FR-04    | Functional   | Basket            | Add products from Home and Browse                |    8     | TC-021..028                                   | Covered  |
| FR-05    | Functional   | Basket            | Real-time count update                           |    7     | TC-007, TC-008, TC-021..025, TC-036           | Covered  |
| FR-06    | Functional   | Basket            | Empty Basket clears cart                         |    5     | TC-036, TC-037, TC-061, TC-072, TC-119        | Covered  |
| FR-07    | Functional   | Basket            | Delivery method selection                        |    6     | TC-038..041, TC-042, TC-068                   | Covered  |
| FR-08    | Functional   | Basket            | Promo code redemption                            |   10     | TC-043..052                                   | Covered  |
| FR-09    | Functional   | Basket            | Basket display, item list, count                 |   17     | TC-029..033, TC-053..069                      | Covered  |
| FR-10    | Functional   | Basket            | Total updates with delivery                      |    7     | TC-039, TC-040, TC-058, TC-066, TC-070, TC-071| Covered  |
| FR-11    | Functional   | Checkout          | Billing form with field validation               |   14     | TC-078..091                                   | Covered  |
| FR-12    | Functional   | Checkout          | Payment form with field validation               |    9     | TC-092..100                                   | Covered  |
| FR-13    | Functional   | Checkout          | Continue triggers full validation                |    7     | TC-101..107                                   | Covered  |
| FR-14    | Functional   | Auth              | Login with email + password                      |    8     | TC-070..077                                   | Covered  |
| FR-15    | Functional   | Auth              | Social login icons displayed                     |    1     | TC-152 (KI-2)                                 | Covered  |
| FR-16    | Functional   | Navigation        | Persistent navbar on all pages                   |    6     | TC-001, TC-002, TC-005..008, TC-158           | Covered  |
| FR-17    | Functional   | Navigation        | Active page indicated in navbar                  |    1     | TC-003                                        | Covered  |
| FR-18    | Functional   | Navigation        | Logo links to homepage                           |    2     | TC-002, TC-004                                | Covered  |
| NFR-01   | Non-Func     | Usability         | Inline validation messages                       |    5     | TC-071, TC-079, TC-101..104                   | Covered  |
| NFR-02   | Non-Func     | Usability         | Fully navigable without login                    |    3     | TC-001, TC-119, TC-130                        | Covered  |
| NFR-03   | Non-Func     | Usability         | Validation messages adjacent to fields           |    1     | TC-104                                        | Covered  |
| NFR-04   | Non-Func     | Compatibility     | Designed for Chrome—Default env on every TC      |    -     | -                                             | Covered  |
| NFR-05   | Non-Func     | Compatibility     | Verify in Firefox + Safari                       |    2     | TC-120, TC-121                                | Covered  |
| NFR-06   | Non-Func     | Accessibility     | Product images have alt text                     |    2     | TC-138, TC-141                                | Covered  |
| NFR-07   | Non-Func     | Accessibility     | Form inputs have visible labels                  |    6     | TC-139, TC-142, TC-088, TC-089, TC-105, TC-144| Covered  |
| NFR-08   | Non-Func     | Accessibility     | Error messages associated with fields            |    2     | TC-140, TC-145                                | Covered  |

**Totals row (formulas):** 26 reqs · 161 TC mappings · all Covered.

---

## Sheet 3 — RTM (Reverse): Test Case → Requirements
158 rows, one per test case (TC-001 through TC-158), each showing which FRs/NFRs it covers. Trace Status: 158 of 158 = Traced. Zero orphans.

---

## Sheet 4 — Test Case Master
Flat data source — 158 rows. Columns:
- TC ID
- Module
- Title
- Priority
- Type
- Automation
- Requirements
- Defect Hint If Fails
Filterable.

---

## Sheet 5 — Execution Log
Where testers update Pass/Fail/Blocked. Has data validation dropdown for Status (Not Run / Pass / Fail / Blocked / Skipped). Conditional formatting: green Pass, red Fail, yellow Blocked.

Columns:
- TC ID
- Title
- Priority
- Module
- Automation
- Status
- Executed By
- Execution Date
- Defect ID
- Notes
158 rows. Each row's Status value flows back into Sheet 2 via SUMPRODUCT.

---

## Sheet 6 — Coverage Summary (live dashboard)

**Requirements Coverage:**
- Total Requirements (FR + NFR): 26 / 100.0%
- Functional (FR-01..18): 18 / 69.2%
- Non-Functional (NFR-01..08): 8 / 30.8%
- Requirements with at least 1 test case: 26 / 100.0%
- Requirements with no test case: 0 / 0.0%

**Test Case Distribution:**
- Total: 158 / 100.0%
- P0 — Critical: 20 / 12.7%
- P1 — High: 41 / 25.9%
- P2 — Medium: 53 / 33.5%
- P3 — Low: 44 / 27.8%
- Smoke (PR-level CI): 8 / 5.1%
- Regression (merge + nightly): 69 / 43.7%
- Manual only: 81 / 51.3%

**Execution Status (live from Execution Log):**
- Not Run: COUNTIF formula
- Pass: COUNTIF formula
- Fail: COUNTIF formula
- Blocked: COUNTIF formula
- Skipped: COUNTIF formula

---

## Sheet 7 — Defect Anchor
Empty grid for logging defects. Columns:
- Defect ID
- Title
- Severity (Critical/High/Medium/Low)
- Priority (P1/P2/P3/P4)
- Status (New/Assigned/In Progress/Fixed/Ready for Retest/Closed/Reopened/Deferred)
- Test Case ID
- Requirement
- Date Raised
- Owner
- Notes

---

## Sheet 8 — Legend
Definitions for:
- Priority (P0/P1/P2/P3)
- Automation (Smoke/Regression/Manual)
- Status (Not Run/Pass/Fail/Blocked/Skipped)
- Coverage Status (Covered/GAP)
- Defect Severity (Critical/High/Medium/Low)
- Defect Priority (P1/P2/P3/P4)