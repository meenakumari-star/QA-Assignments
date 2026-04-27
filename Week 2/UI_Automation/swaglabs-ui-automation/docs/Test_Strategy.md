# Test Strategy
## Swag Labs — UI Automation

| Field           | Value                                       |
|-----------------|---------------------------------------------|
| Document Type   | Test Strategy                               |
| Version         | 1.0                                         |
| Owner           | QA Lead                                     |

---

## 1. Objective
Define the high-level approach for end-to-end UI automation of the Swag Labs e-commerce demo using Playwright + TypeScript and the Page Object Model.

## 2. Scope
- **In scope:** Authentication, inventory, cart, checkout flows across Chromium, Firefox, WebKit.
- **Out of scope:** Mobile, visual regression, accessibility audits, performance profiling.

## 3. Testing Levels
| Level         | Focus                                                                |
|---------------|----------------------------------------------------------------------|
| Smoke         | Login + add-to-cart + checkout happy path                            |
| Functional    | All UI features per the PRD                                          |
| Regression    | Smoke + functional + edge cases                                      |
| Cross-browser | Same suite on Chromium, Firefox, WebKit                              |

## 4. Test Approach
1. **Page Object Model (POM)** — every page has a class in `src/pages/`.
2. **Fixtures** — `loggedInPage` fixture pre-authenticates as `standard_user` to keep tests focused.
3. **Behavior-driven naming** — test titles describe a single user behavior.
4. **Selectors:** prefer stable IDs and `data-test` attributes; avoid `nth-child` chains.
5. **Auto-waiting:** rely on Playwright's built-in waits; avoid `page.waitForTimeout()`.
6. **Independence:** each test owns its preconditions; no test depends on another's state.

## 5. Tools & Frameworks
| Concern             | Tool                                  |
|---------------------|---------------------------------------|
| Test runner         | Playwright Test                       |
| Language            | TypeScript 5.x (strict)               |
| Browsers            | Chromium, Firefox, WebKit             |
| Reporting           | HTML + JUnit                          |
| Trace/video         | Playwright trace, retain-on-failure   |
| Environment config  | dotenv                                |

## 6. Environments
| Environment | URL                                          | Notes                     |
|-------------|----------------------------------------------|---------------------------|
| Public demo | https://www.saucedemo.com                    | Default                   |

## 7. Entry Criteria
- Site is reachable from CI runners.
- No outage on saucedemo.com (manual sanity check).
- Browsers installed via `npx playwright install`.

## 8. Exit Criteria
- 100% of planned test cases executed.
- 0 critical or high-severity defects open.
- ≥ 90% pass rate across all three browsers.
- HTML report and traces archived.

## 9. Risks & Mitigation
| Risk                                                | Mitigation                                                  |
|-----------------------------------------------------|-------------------------------------------------------------|
| `performance_glitch_user` exceeds default timeout   | Per-test `test.setTimeout(90_000)` for that case            |
| `problem_user` has rendering bugs (broken images)   | Excluded from add-to-cart assertions; covered in own suite  |
| Site occasionally returns slow responses            | 1 retry on first failure, `actionTimeout: 15s`              |
| Element selectors break after site update           | Selectors centralized in page objects                       |

## 10. Roles & Responsibilities
- **QA Lead:** Owns this strategy.
- **SDET:** Writes & maintains tests, page objects.
- **Dev:** Stable selectors / `data-test` attributes.
- **Release Manager:** Gates release on suite pass across all browsers.
