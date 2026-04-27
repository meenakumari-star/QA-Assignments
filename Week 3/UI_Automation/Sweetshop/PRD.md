

# Product Requirements Document (PRD)

**Product:** Sweet Shop E-commerce Web App  
**Status:** Draft  
**Last updated:** 2026-04-27  
**Reference URL:** [https://sweetshop.netlify.app/sweets](https://sweetshop.netlify.app/sweets)

---

## 1. Overview

Sweet Shop is a single-page e-commerce web application for browsing and purchasing retro British confectionery. Customers land on a product catalog, add items to a basket, sign in to an account, and proceed to purchase.

> **Note:** The live reference site self-describes as "an intentionally broken web application to help demonstrate Chrome DevTools." This PRD documents the intended product behavior (what a working version should do), not the deliberate bugs.

---

## 2. Goals

- Let visitors browse a curated catalog of retro sweets with price and description.
- Allow visitors to add/remove items from a basket without an account.
- Allow registered users to sign in and complete a purchase.
- Present the brand as a small, nostalgia-focused British sweet retailer.

---

## 3. Non-goals

- Multi-currency or international tax handling (GBP only).
- Inventory management UI for shop owners (no admin surface in v1).
- Subscriptions, gift cards, loyalty programs.
- Mobile native apps.

---

## 4. Target Users

| Persona            | Description                        | Primary need                                 |
|:-------------------|:-----------------------------------|:---------------------------------------------|
| Nostalgic shopper  | UK adult buying childhood sweets   | Find specific items quickly, check price, buy|
| Gift buyer         | Buying a themed gift hamper        | Browse a variety, order in one go            |
| Casual browser     | Arrives via search/social          | Understand what the shop sells, low-friction add-to-basket |

---

## 5. Information Architecture

**Top-level routes:**
- `/sweets` — product catalog (default landing)
- `/about` — brand story / project description
- `/login` — authentication
- `/basket` — basket review and checkout entry

**Persistent header on every page:** Logo · Sweets · About · Login · Basket (count)

**Persistent footer:** copyright line ("Sweet Shop Project 2018" → update to current year)

---

## 6. Functional Requirements

### 6.1 Catalog (`/sweets`)
- **FR-1.1** Display a page heading "Browse sweets" with subcopy "Browse our delicious choice of retro sweets."
- **FR-1.2** Render a responsive grid of products. Reference catalog has 16 items including Chocolate Cups (£1.00), Sherbert Straws (£0.75), Bon Bons (£1.00), Wham Bars (£0.15), Bubbly (£0.10), Dolly Mixture (£0.90), etc.
- **FR-1.3** Each product card shows: image, name, short description, price formatted as £0.00, and an Add to Basket button.
- **FR-1.4** Clicking Add to Basket increments the basket counter in the header and persists the basket across page navigations (localStorage acceptable for v1).
- **FR-1.5** Product data is loaded from a single source (JSON file or API endpoint) — no hard-coded markup per product.

### 6.2 Basket
- **FR-2.1** Header shows live item count, e.g. 0 Basket, 3 Basket.
- **FR-2.2** Basket page lists each line item with name, unit price, quantity, line total, and a remove control.
- **FR-2.3** Quantity can be increased or decreased; setting quantity to 0 removes the line.
- **FR-2.4** Subtotal is computed client-side and updates immediately on change.
- **FR-2.5** A Checkout CTA is available; if the user is not signed in, it routes to `/login` and returns to checkout after success.

### 6.3 Authentication (`/login`)
- **FR-3.1** Form fields: Email address, Password.
- **FR-3.2** Both fields are required; show inline error messages on blur and on submit ("Please enter a valid email address", "Please enter a valid password").
- **FR-3.3** Header copy: "Please enter your email address and password in order to login to your account."
- **FR-3.4** Successful login redirects the user back to their previous page (or `/sweets` if none).
- **FR-3.5** *(Gap to fix)* The reference site is missing Sign up and Forgot password links — both should exist in v1.
- **FR-3.6** Social icons (Twitter, Facebook, LinkedIn) in the page footer link to the brand's real profiles, not #.

### 6.4 About (`/about`)
- **FR-4.1** Static page with brand story, year founded, and contact email.
- **FR-4.2** Editable via a single content file so non-engineers can update copy.

---

## 7. Non-Functional Requirements

- **Performance:** First contentful paint < 1.5s on 4G; catalog grid renders below 200ms after data load.
- **Accessibility:** WCAG 2.1 AA — alt text on every product image, form labels associated with inputs, visible focus states, keyboard-navigable Add-to-Basket.
- **Responsive:** Catalog grid reflows from 4 columns (desktop) → 2 (tablet) → 1 (mobile).
- **Browsers:** Latest two versions of Chrome, Firefox, Safari, Edge.
- **SEO:** Meaningful <title> per route, OpenGraph tags on product pages, semantic headings.
- **Analytics:** Page views and add_to_basket events tracked.

---

## 8. Data Model (v1)

| Entity      | Fields                                                      |
|:----------- |:------------------------------------------------------------|
| Product     | id, slug, name, description, priceGBP, imageUrl, inStock    |
| BasketItem  | productId, quantity                                        |
| User        | id, email, passwordHash, createdAt                          |

---

## 9. Gaps in the Current Reference Site to Address in v1

- No search or category filter on the catalog — add a search input and at least a price-sort control.
- No sign-up route — add `/register`.
- No forgot-password flow — add `/forgot-password`.
- Social links are placeholder # — wire them up or remove.
- Footer year hard-coded to 2018 — make dynamic.
- No checkout/payment flow visible — define in a follow-up PRD (Stripe Checkout is the assumed integration).

---

## 10. Out of Scope for v1

- Reviews, ratings, wishlists
- Multi-currency
- Gift wrapping
- Recommendations
- Bundles
- Stock alerts
- Admin dashboard
