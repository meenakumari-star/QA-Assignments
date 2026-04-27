# Sweet Shop - Production-Grade Playwright TypeScript Testing Framework

A comprehensive, enterprise-ready Playwright testing framework built with TypeScript for end-to-end testing of the Sweet Shop e-commerce application (https://sweetshop.netlify.app).

## 🚀 Features

- **TypeScript Support**: Full TypeScript integration with strict type safety
- **Cross-Browser Testing**: Chromium, Firefox, and WebKit support  
- **Page Object Model**: Complete separation of test logic and UI elements
- **Custom Fixtures**: Playwright fixtures for page objects and API clients
- **Test Data Management**: JSON-based static data and Faker.js dynamic generation
- **Path Aliases**: Clean imports using @pages, @utils, @data, @fixtures
- **Multiple Reporters**: HTML, JSON, and JUnit reporting
- **Screenshots & Videos**: Automatic capture on test failures
- **Parallel Execution**: Fast test execution with parallel running
- **Comprehensive Test Coverage**: 125+ test scenarios mapped to optimized test cases

## 📁 Project Structure

```
sweetshop/
├── tests/
│   └── ui/
│       ├── navigation/     # Navigation flow tests
│       │   └── navigation.spec.ts
│       ├── sweets/         # Product catalog tests  
│       │   └── catalog.spec.ts
│       └── basket/         # Shopping cart & checkout tests
│           ├── shopping-cart.spec.ts
│           └── checkout.spec.ts
├── tests/pages/            # Page Object Models
│   ├── SweetShopBasePage.ts    # Base page with common functionality
│   ├── HomePage.ts             # Home page operations
│   ├── SweetsPage.ts           # Product catalog management
│   ├── BasketPage.ts           # Shopping cart operations  
│   └── CheckoutPage.ts         # Checkout process handling
├── fixtures/               # Playwright custom fixtures
│   └── pageFixtures.ts     # Page object injection
├── data/                   # Test data files
│   ├── users.json         # User credentials & checkout data
│   ├── sweets.json        # Product catalog data
│   └── testData.ts        # TypeScript data interfaces
├── utils/                  # Utility functions
│   ├── dataGenerator.ts   # Faker.js data generation
│   └── logger.ts          # Test logging utility
├── test-documentation/     # Complete test documentation
│   ├── comprehensive-test-cases.md
│   └── test-scenarios/
├── playwright.config.ts    # Playwright configuration
├── tsconfig.json          # TypeScript settings with path aliases
└── package.json           # Dependencies & test scripts
```

## 🧪 Test Coverage

### Implemented Test Cases (Production-Ready)

| Test Case ID | Coverage | Priority | Location | Status |
|--------------|----------|----------|----------|---------|
| **TC-OPT-001** | Complete Navigation Flow (TS-001 to TS-013) | Critical | `tests/ui/navigation/navigation.spec.ts` | ✅ |
| **TC-OPT-002** | Product Catalog Validation (TS-016 to TS-028) | Critical | `tests/ui/sweets/catalog.spec.ts` | ✅ |
| **TC-OPT-003** | Shopping Cart Workflow (TS-031 to TS-048) | Critical | `tests/ui/basket/shopping-cart.spec.ts` | ✅ |
| **TC-OPT-004** | Checkout Process (TS-051 to TS-075) | Critical | `tests/ui/basket/checkout.spec.ts` | ✅ |

### Test Tags System
- **Type**: `@ui`, `@api`
- **Priority**: `@smoke`, `@regression`, `@critical`  
- **Special**: `@performance`, `@negative`, `@edge`

## 🛠️ Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## 📦 Installation

```bash
# Clone and install dependencies
npm install

# Install Playwright browsers  
npm run test:install
```

## 🧪 Running Tests

### Run All Tests
```bash
npm test                    # Complete test suite
npm run test:ui            # UI tests with visible browser
```

### Run by Priority/Tags
```bash
npm run test:smoke         # Smoke tests (@smoke tag)
npm run test:critical      # Critical priority tests (@critical)
npm run test:regression    # Full regression suite (@regression)
```

### Run by Feature Area
```bash
npm run test:navigation    # Navigation flow tests
npm run test:catalog       # Product catalog tests
npm run test:basket        # Shopping cart & checkout tests
```

### Run by Browser
```bash
npm run test:chromium      # Chrome/Chromium only
npm run test:firefox       # Firefox only
npm run test:webkit        # Safari/WebKit only
```

### Debug & Reports
```bash
npm run test:debug         # Debug mode with inspector
npm run test:headed        # Run with visible browser
npm run test:report        # Open HTML report
```

## 📝 Test Development Standards

### Mandatory Test Structure
```typescript
import { test, expect } from '@fixtures/pageFixtures';
import userData from '@data/users.json';

test.describe('Feature: <Feature Name>', () => {
  /**
   * Test Case: TC-XXX-001
   * Description: <Clear test description>
   * Preconditions: <Required setup conditions>
   * Steps: <Numbered test steps>
   * Expected: <Expected results>
   */
  test('TC-XXX-001: should <behavior> when <condition> @smoke @ui @critical', async ({ 
    homePage, sweetsPage 
  }) => {
    // Arrange - Setup test data and preconditions
    // Act - Perform the test actions
    // Assert - Verify expected results
  });
});
```

### Page Object Usage (MANDATORY)
```typescript
// ✅ CORRECT - Always use page objects
await sweetsPage.addProductToBasket("Chocolate Cups");
await basketPage.verifyCartTotal(1.00);
await checkoutPage.fillBillingInformation(userData.validBilling);

// ❌ FORBIDDEN - No raw selectors in test files
await page.locator('.add-to-basket').click();
await page.fill('#email', 'test@example.com');
```

### Test Data Usage (MANDATORY)
```typescript
// ✅ CORRECT - Use data files
import users from '@data/users.json';
import sweets from '@data/sweets.json';

// ✅ CORRECT - Use data generator for dynamic data
import { DataGenerator } from '@utils/dataGenerator';
const user = DataGenerator.generateUser();
const billingData = DataGenerator.generateBillingData();

// ❌ FORBIDDEN - No hardcoded data in tests
const email = 'hardcoded@email.com';
const price = 1.99;
```

## 🔧 Configuration

### Path Aliases (Required)
- `@pages/*` → `./tests/pages/*` - Page object models
- `@utils/*` → `./utils/*` - Utility functions  
- `@data/*` → `./data/*` - Test data files
- `@fixtures/*` → `./fixtures/*` - Playwright fixtures
- `@api/*` → `./api-clients/*` - API service layer

### Environment Support
- **Base URL**: https://sweetshop.netlify.app
- **Browsers**: Chromium, Firefox, WebKit  
- **Parallel Workers**: Configurable per environment
- **Retries**: 2 retries on CI, 0 locally
- **Timeout**: 30s default, configurable per test

## 📊 Test Reports

After running tests, comprehensive reports are generated:
- `playwright-report/` - Interactive HTML report with traces
- `test-results/` - JSON and XML reports for CI/CD integration

## 🎯 Test Case Implementation Details

### TC-OPT-001: Navigation Flow
- **Coverage**: 9 navigation scenarios (TS-001 to TS-013)
- **Features**: Cross-page navigation, state persistence, browser controls
- **Validations**: URL verification, basket persistence, error handling

### TC-OPT-002: Product Catalog  
- **Coverage**: 13 catalog scenarios (TS-016 to TS-028)
- **Features**: Product validation, pricing, layout, performance
- **Validations**: 16 products, correct pricing format, responsive design

### TC-OPT-003: Shopping Cart
- **Coverage**: 18 cart scenarios (TS-031 to TS-048)  
- **Features**: Add/remove items, calculations, persistence
- **Validations**: Accurate totals, cross-page state, session management

### TC-OPT-004: Checkout Process
- **Coverage**: 25 checkout scenarios (TS-051 to TS-075)
- **Features**: Form validation, delivery options, payment processing
- **Validations**: Field validation, promo codes, complete workflow

## 🏗️ Framework Architecture

### Design Principles
1. **Test Independence**: Each test runs in complete isolation
2. **No Flaky Tests**: Web-first assertions, no arbitrary waits
3. **Maintainable Code**: Page objects abstract all UI interactions
4. **Type Safety**: Strict TypeScript, no `any` types
5. **Readable Tests**: Clear naming, comprehensive documentation
6. **Data Separation**: External JSON files and generated data

### Dependencies
```json
{
  "@playwright/test": "^1.59.1",     // Core testing framework
  "typescript": "^6.0.3",            // TypeScript compiler
  "@types/node": "^25.6.0",          // Node.js type definitions  
  "@faker-js/faker": "^9.2.0"        // Dynamic test data generation
}
```

## 🤝 Best Practices Enforced

- ✅ **Strict TypeScript** - No `any` types, full type safety
- ✅ **Page Object Model** - Zero selectors in test files
- ✅ **Test Independence** - Each test runs in isolation with cleanup
- ✅ **Proper Test Data** - JSON files + Faker.js generation
- ✅ **Meaningful Names** - TC-XXX-ID format with clear descriptions
- ✅ **Web-First Assertions** - Playwright's built-in auto-waiting
- ✅ **Custom Fixtures** - Reusable page object injection
- ✅ **Path Aliases** - Clean, maintainable import statements
- ✅ **Comprehensive Tags** - Priority and type classification
- ✅ **JSDoc Documentation** - Detailed headers for every test
- ✅ **Error Handling** - Graceful test cleanup and error recovery

## 🚀 Production Ready

This framework is production-grade and implements enterprise testing standards:

- **125+ Test Scenarios** mapped to executable test cases
- **Complete Coverage** of Sweet Shop application functionality  
- **CI/CD Integration** with comprehensive reporting
- **Maintainable Architecture** with clear separation of concerns
- **Performance Optimized** with parallel execution and smart waits
- **Documentation Driven** with full traceability to requirements

Run `npm run test:smoke` to execute the critical test suite! 🎭

---

**Framework Version**: 1.0.0  
**Last Updated**: April 2026  
**Test Documentation**: See `/test-documentation/` for complete test cases and scenarios