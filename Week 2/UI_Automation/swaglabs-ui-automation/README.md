# Swag Labs UI Automation 🛒

End-to-end UI automation framework for **SauceDemo (Swag Labs)** built with **Playwright + TypeScript** using the Page Object Model.

## 📂 Project Structure
```
swaglabs-ui-automation/
├── src/
│   ├── pages/        # Page objects (Login, Inventory, Cart, Checkout, Base)
│   ├── utils/        # Test data, error messages, products
│   └── fixtures/     # Custom Playwright fixtures (loggedInPage)
├── tests/
│   ├── login.spec.ts
│   ├── inventory.spec.ts
│   ├── cart.spec.ts
│   └── checkout.spec.ts
├── docs/             # PRD, Test Strategy, Test Plan, RTM
├── package.json
├── tsconfig.json
└── playwright.config.ts
```

## 🚀 Setup

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Install
```bash
npm install
npx playwright install      # downloads Chromium / Firefox / WebKit
```

## ▶️ Running Tests

```bash
npm test                    # full suite, all 3 browsers
npm run test:smoke          # @smoke only
npm run test:regression     # @regression only
npm run test:chromium       # only Chromium
npm run test:firefox        # only Firefox
npm run test:webkit         # only WebKit
npm run test:headed         # see the browser
npm run test:debug          # Playwright Inspector
npm run report              # open HTML report
npm run codegen             # record new tests interactively
npm run lint                # type-check (no emit)
```

## 🌍 Environment Variables
Optional `.env`:
```
BASE_URL=https://www.saucedemo.com
```

## 📊 Reports & Artifacts
- HTML — `playwright-report/index.html`
- JUnit — `test-results/results.xml`
- Screenshots — only on failure
- Videos — retained on failure
- Traces — on first retry

## 🧪 Test Tags
| Tag           | Purpose                              |
|---------------|--------------------------------------|
| `@smoke`      | Critical happy paths                 |
| `@regression` | Full regression suite                |

## 👤 Test Users (all use password `secret_sauce`)
| Username                    | Behavior                               |
|-----------------------------|----------------------------------------|
| `standard_user`             | Default happy path                     |
| `locked_out_user`           | Blocked at login                       |
| `problem_user`              | UI defects (broken images, etc.)       |
| `performance_glitch_user`   | Slow page loads                        |
| `error_user`                | Triggers errors                        |
| `visual_user`               | Visual regression scenarios            |

## 📚 Documentation
See [`docs/`](./docs):
- `PRD.md` — Product Requirements
- `Test_Strategy.md` — High-level approach
- `Test_Plan.md` — Detailed test cases & schedule
- `RTM.md` — Requirements ↔ Test Cases mapping

## 📈 Coverage
- 27 functional requirements
- 27 automated test cases
- 100% requirement coverage

## 🛠️ Troubleshooting
| Issue                                    | Fix                                                |
|------------------------------------------|----------------------------------------------------|
| `browserType.launch: Executable doesn't exist` | `npx playwright install`                       |
| Performance glitch user test times out   | Already extends to 90s — check network             |
| Selectors fail after site update         | Update locators in `src/pages/*.ts` only           |
| Cannot find module on import             | `rm -rf node_modules && npm install`               |
