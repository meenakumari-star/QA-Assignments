# Product Requirements Document (PRD)
## Swag Labs (SauceDemo) — UI Automation Coverage

| Field           | Value                                       |
|-----------------|---------------------------------------------|
| Product         | Swag Labs (saucedemo.com)                   |
| Document Type   | Product Requirements Document               |
| Version         | 1.0                                         |
| Owner           | QA Automation Team                          |
| Status          | Approved                                    |

---

## 1. Purpose
Swag Labs is a public e-commerce demo site widely used for UI test practice. This PRD defines the user-facing functionality the automation suite must validate end-to-end.

## 2. Background
The site supports a small product catalog with a complete buy flow: login → browse → add to cart → checkout → confirmation. It exposes several preset users that simulate real-world states (locked out, performance glitch, visual issues, errors), making it ideal for negative-path coverage.

## 3. User Personas
| Persona                  | Username                  | Behavior                                |
|--------------------------|---------------------------|-----------------------------------------|
| Standard customer        | `standard_user`           | Normal happy-path                       |
| Locked-out customer      | `locked_out_user`         | Cannot login                            |
| Problem customer         | `problem_user`            | Mis-rendered images / UI defects        |
| Performance glitch user  | `performance_glitch_user` | Slow page loads                         |
| Error user               | `error_user`              | Triggers application errors             |
| Visual user              | `visual_user`             | Visual regression scenarios             |

All personas use the password `secret_sauce`.

## 4. Functional Requirements

### FR-1: Authentication
- The user can log in with valid credentials.
- The system blocks locked-out users with a clear error.
- The system rejects invalid credentials and empty fields with field-specific errors.
- The user can log out via the burger menu and is returned to the login page.

### FR-2: Product Inventory
- The user lands on the inventory page after successful login.
- The catalog renders **6** products with name, description, price, and image.
- The user can sort products by:
  - Name A → Z
  - Name Z → A
  - Price low → high
  - Price high → low
- The user can add a product to the cart from the inventory list.
- The user can remove a product from the cart from the inventory list.
- The cart badge reflects the current item count.

### FR-3: Cart
- The cart page lists all added items with name, description, price, and quantity.
- The user can remove items from the cart.
- The user can continue shopping (returns to inventory).
- The user can proceed to checkout.
- Cart contents persist across page reloads within the same session.
- Reset App State (burger menu) clears the cart.

### FR-4: Checkout
- Step 1 (Information): user enters First Name, Last Name, Postal Code.
- All three fields are required; missing any field surfaces a specific error.
- Step 2 (Overview): summary shows item subtotal, tax, total. Subtotal + tax must equal total (within rounding).
- Step 3 (Complete): "Thank you for your order!" message and "Back Home" CTA.

## 5. Non-Functional Requirements
- Pages render under 5 seconds for `standard_user` on broadband.
- `performance_glitch_user` may take up to 90 seconds — automation must accommodate.
- Site supports modern desktop browsers: Chromium, Firefox, WebKit.

## 6. Out of Scope
- Mobile responsiveness validation
- Visual regression assertions (separate suite — `visual_user` is reserved for this)
- Payment gateway integration (none exists on SauceDemo)
- Email confirmations (none sent)

## 7. Success Metrics
- 100% of in-scope flows automated.
- ≥ 90% pass rate per browser project.
- Suite runtime ≤ 8 minutes per browser.
- Zero flaky tests over 10 consecutive runs on `standard_user` flows.
