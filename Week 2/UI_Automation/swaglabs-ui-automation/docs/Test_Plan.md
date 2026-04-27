# Test Plan
## Swag Labs — UI Automation Suite

| Field           | Value                                       |
|-----------------|---------------------------------------------|
| Document Type   | Test Plan                                   |
| Version         | 1.0                                         |
| Owner           | QA Automation Engineer                      |

---

## 1. Introduction
This plan enumerates every test case in the Swag Labs UI suite, with priority and module mapping.

## 2. Features to Be Tested
- Login (standard, problem, performance, locked-out, invalid, empty fields)
- Inventory (catalog, sorting, add/remove, badge)
- Cart (add, remove, persistence, navigation)
- Checkout (form validation, totals, completion)
- Burger menu (logout, reset state)

## 3. Features Not to Be Tested
- Mobile responsiveness
- Visual regression
- Accessibility / WCAG audits

## 4. Test Cases Overview

### 4.1 Login Module
| ID            | Title                                                       | Type      | Priority |
|---------------|-------------------------------------------------------------|-----------|----------|
| TC_LOGIN_001  | Standard user can log in                                    | Positive  | P1       |
| TC_LOGIN_002  | Locked-out user sees lockout error                          | Negative  | P1       |
| TC_LOGIN_003  | Invalid credentials are rejected                            | Negative  | P1       |
| TC_LOGIN_004  | Empty username shows required error                         | Negative  | P2       |
| TC_LOGIN_005  | Empty password shows required error                         | Negative  | P2       |
| TC_LOGIN_006  | Problem user can log in                                     | Positive  | P2       |
| TC_LOGIN_007  | Performance glitch user can log in                          | Positive  | P3       |
| TC_LOGIN_008  | Logout returns user to login screen                         | Positive  | P1       |

### 4.2 Inventory Module
| ID         | Title                                                         | Type     | Priority |
|------------|---------------------------------------------------------------|----------|----------|
| TC_INV_001 | Inventory shows exactly 6 products                            | Positive | P1       |
| TC_INV_002 | Sort items A → Z                                              | Positive | P2       |
| TC_INV_003 | Sort items Z → A                                              | Positive | P2       |
| TC_INV_004 | Sort items by price low → high                                | Positive | P2       |
| TC_INV_005 | Sort items by price high → low                                | Positive | P2       |
| TC_INV_006 | Add single item updates badge                                 | Positive | P1       |
| TC_INV_007 | Add multiple items updates badge                              | Positive | P1       |
| TC_INV_008 | Remove item from inventory list updates badge                 | Positive | P2       |
| TC_INV_009 | Reset App State clears cart                                   | Positive | P2       |

### 4.3 Cart Module
| ID          | Title                                                         | Type     | Priority |
|-------------|---------------------------------------------------------------|----------|----------|
| TC_CART_001 | Cart shows items added from inventory                         | Positive | P1       |
| TC_CART_002 | Remove item from cart updates count                           | Positive | P1       |
| TC_CART_003 | Continue shopping returns to inventory                        | Positive | P2       |
| TC_CART_004 | Empty cart still allows checkout navigation                   | Edge     | P3       |
| TC_CART_005 | Cart persists across page reload                              | Positive | P2       |

### 4.4 Checkout Module
| ID         | Title                                                          | Type     | Priority |
|------------|----------------------------------------------------------------|----------|----------|
| TC_CHK_001 | Complete checkout end to end                                   | Positive | P1       |
| TC_CHK_002 | Missing first name shows required error                        | Negative | P1       |
| TC_CHK_003 | Missing last name shows required error                         | Negative | P1       |
| TC_CHK_004 | Missing postal code shows required error                       | Negative | P1       |
| TC_CHK_005 | Back to products from order complete page                      | Positive | P2       |

## 5. Schedule
| Phase                                  | Duration |
|----------------------------------------|----------|
| Smoke run (Chromium only)              | ~2 min   |
| Full regression (Chromium)             | ~5 min   |
| Full regression × 3 browsers           | ~15 min  |
| Triage & re-run                        | ~20 min  |

## 6. Deliverables
- Playwright HTML report (`playwright-report/index.html`)
- JUnit XML (`test-results/results.xml`)
- Screenshots & videos for failures
- Trace files for retried tests

## 7. Test Execution Strategy
1. **Per commit:** Smoke (`@smoke`) on Chromium only.
2. **Per PR merge:** Full regression on Chromium.
3. **Nightly:** Full regression × Chromium + Firefox + WebKit.

## 8. Defect Management
- Severity: Blocker / Critical / Major / Minor.
- Defects tracked in Jira project `SWAGLABS`.
- Failures with traces are auto-attached to ticket comments via CI.
