# Test Scenarios Index - Sweet Shop

This directory contains all test scenarios for the Sweet Shop e-commerce website testing.

## Overview
The Sweet Shop is an intentionally broken web application designed to demonstrate Chrome DevTools features. It includes a product catalog, shopping cart, login functionality, and checkout process.

## Test Scenario Files

### 1. [Navigation Scenarios](navigation-scenarios.md)
- **Scenarios**: TS-001 to TS-015 (15 scenarios)
- **Coverage**: Website navigation, menu functionality, basket counter, browser navigation
- **Priority**: High priority scenarios for basic navigation functionality

### 2. [Product Catalog Scenarios](product-catalog-scenarios.md)
- **Scenarios**: TS-016 to TS-030 (15 scenarios)
- **Coverage**: Product display, pricing, images, layout, browser compatibility
- **Priority**: High priority for core e-commerce functionality

### 3. [Shopping Cart Scenarios](shopping-cart-scenarios.md)
- **Scenarios**: TS-031 to TS-050 (20 scenarios)
- **Coverage**: Add to cart, remove items, cart persistence, price calculations
- **Priority**: High priority for shopping functionality

### 4. [Checkout Scenarios](checkout-scenarios.md)
- **Scenarios**: TS-051 to TS-075 (25 scenarios)
- **Coverage**: Delivery options, billing address, payment details, form validation
- **Priority**: High priority for purchase completion

### 5. [Authentication Scenarios](authentication-scenarios.md)
- **Scenarios**: TS-076 to TS-100 (25 scenarios)
- **Coverage**: Login functionality, security, social media integration
- **Priority**: High priority for user management

### 6. [UI and Usability Scenarios](ui-usability-scenarios.md)
- **Scenarios**: TS-101 to TS-125 (25 scenarios)
- **Coverage**: Cross-browser compatibility, accessibility, responsive design, performance
- **Priority**: Medium to low priority for enhanced user experience

## Total Scenario Coverage
- **Total Scenarios**: 125 scenarios
- **Positive Scenarios**: 89 scenarios
- **Negative Scenarios**: 22 scenarios
- **Edge/Boundary Scenarios**: 11 scenarios
- **Security Scenarios**: 3 scenarios

## Test Types Distribution
- **Positive Tests**: 71.2% (89 scenarios)
- **Negative Tests**: 17.6% (22 scenarios)
- **Edge/Boundary Tests**: 8.8% (11 scenarios)
- **Security Tests**: 2.4% (3 scenarios)

## Priority Distribution
- **High Priority**: 75 scenarios (60%)
- **Medium Priority**: 38 scenarios (30.4%)
- **Low Priority**: 12 scenarios (9.6%)

## Next Steps
1. Review and validate all scenarios
2. Generate detailed test cases for each scenario
3. Create test suites for different testing phases
4. Implement automation scripts using Playwright