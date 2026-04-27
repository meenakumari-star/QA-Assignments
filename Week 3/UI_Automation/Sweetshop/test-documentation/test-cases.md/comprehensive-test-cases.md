# Optimized Test Cases - Sweet Shop (Comprehensive Coverage)

## Coverage Analysis
- **Total Scenarios**: 125 scenarios (TS-001 to TS-125)
- **Optimized Test Cases**: 12 comprehensive test cases
- **Coverage Ratio**: 1 test case covers ~10 scenarios on average
- **Approach**: Data-driven, integration-focused, consolidated validation

---

## Test Case ID: TC-OPT-001

**Scenario Coverage:** TS-001, TS-002, TS-003, TS-004, TS-005, TS-007, TS-010, TS-012, TS-013  
**Priority:** High  
**Type:** Integration  
**Role:** General User

**Description:** Complete Navigation Flow with State Verification

**Preconditions:**
- Sweet Shop website is accessible
- Browser supports JavaScript and session storage
- All navigation pages are functional

**Test Data:**
```json
{
  "pages": [
    {"name": "Home", "url": "/", "element": "Sweet Shop logo"},
    {"name": "Sweets", "url": "/sweets", "element": "Sweets link"},
    {"name": "About", "url": "/about", "element": "About link"},
    {"name": "Login", "url": "/login", "element": "Login link"}, 
    {"name": "Basket", "url": "/basket", "element": "Basket link"}
  ]
}
```

**Steps:**
1. **Navigation Loop Testing:**
   - For each page in test data, navigate using menu links
   - Verify correct URL and page content loads
   - Verify current page highlighted in navigation
   - Test browser back/forward buttons
   - Test direct URL access for each page
2. **State Persistence Testing:**
   - Add item to cart from Sweets page
   - Navigate through all pages
   - Verify basket counter persists across navigation
3. **Edge Case Validation:**
   - Test rapid multiple navigation clicks
   - Test invalid URL navigation
   - Verify error handling and recovery

**Expected Results:**
- All navigation links function correctly
- Page content loads appropriately for each URL
- Current page indicator works consistently  
- Browser navigation (back/forward) functions properly
- Direct URL access works for all pages
- Basket state persists across page navigation
- Invalid URLs handled gracefully
- Rapid navigation doesn't cause errors

---

## Test Case ID: TC-OPT-002

**Scenario Coverage:** TS-016, TS-017, TS-018, TS-019, TS-020, TS-021, TS-026, TS-027, TS-028  
**Priority:** High  
**Type:** Data-Driven  
**Role:** General User

**Description:** Product Catalog Comprehensive Validation

**Preconditions:**
- Sweets catalog page is accessible
- All product images and data are loaded
- Browser supports CSS grid/flexbox

**Test Data:**
```json
{
  "expectedProducts": [
    {"name": "Chocolate Cups", "price": "£1.00", "description": "Candy Chocolate Cups"},
    {"name": "Sherbert Straws", "price": "£0.75", "description": "Rainbow Dust Straws"},
    {"name": "Sherbert Discs", "price": "£0.95", "description": "UFO's Sherbert Filled"},
    {"name": "Bon Bons", "price": "£1.00", "description": "Pink Strawberry Bonbons"},
    {"name": "Jellies", "price": "£0.75", "description": "Fruit flavoured chewy"},
    {"name": "Fruit Salads", "price": "£0.50", "description": "Fruit salad chews"},
    {"name": "Bubble Gums", "price": "£0.25", "description": "Fruit flavoured bubble"},
    {"name": "Wham Bars", "price": "£0.15", "description": "Wham original raspberry"},
    {"name": "Whistles", "price": "£0.25", "description": "Candy whistles"},
    {"name": "Sherbert Fountains", "price": "£0.35", "description": "Sherbert fountain"},
    {"name": "Swansea Mixture", "price": "£1.50", "description": "Originally made in Swansea"},
    {"name": "Chocolate Beans", "price": "£0.80", "description": "Chocolate beans"},
    {"name": "Nerds", "price": "£0.60", "description": "American candy sweets"},
    {"name": "Drumsticks", "price": "£0.20", "description": "Raspberry and milk"},
    {"name": "Bubbly", "price": "£0.10", "description": "Fruit flavoured bubble gum"},
    {"name": "Dolly Mixture", "price": "£0.90", "description": "Dolly mixture"}
  ],
  "totalExpected": 16
}
```

**Steps:**
1. **Product Inventory Validation:**
   - Navigate to /sweets page
   - Count total products displayed
   - Verify exactly 16 products are present
2. **Product Data Validation:**
   - For each product in expectedProducts array:
     - Verify product name matches expected
     - Verify price format and amount correct
     - Verify description text present
     - Verify "Add to Basket" button present
3. **Visual Layout Validation:**
   - Verify products displayed in grid format
   - Verify images load for all products (check for alt text)
   - Verify consistent layout and spacing
4. **Performance and Error Handling:**
   - Measure page load time (should be < 3 seconds)
   - Test with network throttling
   - Test missing image handling
   - Test invalid price format handling

**Expected Results:**
- Exactly 16 products displayed in catalog
- All product data matches expected values
- All prices in correct GBP format (£X.XX)
- All products have functional "Add to Basket" buttons
- Grid layout displays consistently
- All product images load or show appropriate fallback
- Page loads within acceptable time limits
- Error conditions handled gracefully

---

## Test Case ID: TC-OPT-003

**Scenario Coverage:** TS-031, TS-032, TS-033, TS-034, TS-035, TS-036, TS-037, TS-038, TS-039, TS-044, TS-047, TS-048  
**Priority:** High  
**Type:** Integration  
**Role:** General User

**Description:** Complete Shopping Cart Workflow with Calculations

**Preconditions:**
- Product catalog is functional
- Basket starts empty (0 items)
- Cart persistence mechanisms work

**Test Data:**
```json
{
  "cartOperations": [
    {"action": "add", "product": "Chocolate Cups", "price": 1.00, "expectedCount": 1, "expectedTotal": 1.00},
    {"action": "add", "product": "Sherbert Straws", "price": 0.75, "expectedCount": 2, "expectedTotal": 1.75},
    {"action": "add", "product": "Chocolate Cups", "price": 1.00, "expectedCount": 3, "expectedTotal": 2.75},
    {"action": "remove", "product": "Sherbert Straws", "expectedCount": 2, "expectedTotal": 2.00},
    {"action": "empty", "expectedCount": 0, "expectedTotal": 0.00}
  ]
}
```

**Steps:**
1. **Initial State Validation:**
   - Verify basket shows "0 Basket" initially
   - Navigate to basket page, confirm empty state
2. **Cart Operations Loop:**
   - For each operation in cartOperations:
     - Perform the specified action (add/remove/empty)
     - Verify basket counter updates immediately
     - Navigate to basket page
     - Verify correct items and quantities displayed
     - Verify total calculation is accurate
     - Navigate back to sweets page
3. **Rapid Operations Testing:**
   - Rapidly click "Add to Basket" 5 times for same product
   - Verify system handles rapid clicks appropriately
4. **Cross-Page Persistence:**
   - Add multiple items to cart
   - Navigate through all pages (About, Login, etc.)
   - Verify cart count and contents persist
5. **Session Management:**
   - Refresh browser page
   - Verify cart contents maintained
6. **Precision Testing:**
   - Add items with various decimal prices
   - Verify calculations to 2 decimal places
   - Test edge cases (0.01, 0.99, etc.)

**Expected Results:**
- Basket counter updates immediately for all operations
- Cart contents accurately reflect all operations
- Total calculations are mathematically correct
- Items persist across page navigation
- Cart state maintained through browser refresh
- Rapid operations handled without errors
- Decimal precision maintained in all calculations
- Delete item functionality works correctly
- Empty basket functionality clears all items

---

## Test Case ID: TC-OPT-004

**Scenario Coverage:** TS-051, TS-052, TS-053, TS-054, TS-055, TS-056, TS-057, TS-058, TS-059, TS-060, TS-070, TS-071, TS-075  
**Priority:** High  
**Type:** Integration  
**Role:** General User

**Description:** Complete Checkout Process with Form Validation

**Preconditions:**
- Items are present in basket
- Checkout form is functional
- All form validation rules are active

**Test Data:**
```json
{
  "validData": {
    "delivery": "Standard Shipping (£1.99)",
    "promoCode": "TEST10",
    "billing": {
      "firstName": "John",
      "lastName": "Smith", 
      "email": "john.smith@example.com",
      "address": "123 Main Street",
      "address2": "Apartment 4B",
      "country": "United Kingdom",
      "city": "Bristol",
      "zip": "BS1 1AA"
    },
    "payment": {
      "nameOnCard": "John Smith",
      "cardNumber": "4111111111111111",
      "expiration": "12/25",
      "cvv": "123"
    }
  },
  "invalidData": {
    "emails": ["notanemail", "test@", "@example.com", "test.example.com"],
    "cardNumbers": ["123", "abcd1234", "1111"],
    "emptyFields": ["firstName", "lastName", "email", "cardNumber"]
  }
}
```

**Steps:**
1. **Pre-checkout Setup:**
   - Add "Chocolate Cups" (£1.00) to basket
   - Navigate to basket/checkout page
2. **Delivery Options Testing:**
   - Verify "Collect (FREE)" selected by default
   - Select "Standard Shipping (£1.99)"
   - Verify total updates to include shipping
   - Test switching between options
3. **Promo Code Testing:**
   - Enter valid promo code, click Redeem
   - Verify discount application or error handling
   - Test invalid promo code
4. **Billing Address Validation:**
   - Test each field with valid data from validData.billing
   - Test dropdown functionality (Country, City)
   - Verify all cities (Bristol, Cardiff, Swansea) available
5. **Payment Information Testing:**
   - Fill payment fields with validData.payment
   - Verify CVV field is numeric spinner
   - Test help text display
6. **Form Validation Testing:**
   - For each field in emptyFields: leave empty and attempt submit
   - For each email in invalidData.emails: test and verify error
   - For each cardNumber in invalidData.cardNumbers: test validation
7. **Complete Checkout Testing:**
   - Fill all forms with valid data
   - Calculate expected total (item + shipping - discount)
   - Click "Continue to checkout"
   - Verify checkout process initiates

**Expected Results:**
- Delivery options function and update totals correctly
- Promo code system provides appropriate feedback
- All form fields accept valid input correctly
- Dropdown menus contain expected options
- Form validation prevents submission with invalid/empty data
- Error messages are clear and helpful
- Valid complete forms allow checkout to proceed
- Total calculations include all charges and discounts
- Checkout process initiates without errors

---

## Test Case ID: TC-OPT-005

**Scenario Coverage:** TS-076, TS-077, TS-078, TS-080, TS-081, TS-082, TS-083, TS-084, TS-085, TS-088, TS-089  
**Priority:** High  
**Type:** Security  
**Role:** General User

**Description:** Authentication Security and Validation Testing

**Preconditions:**
- Login page is accessible
- Authentication system is functional
- Security measures are implemented

**Test Data:**
```json
{
  "validCredentials": {
    "email": "test@example.com",
    "password": "password123"
  },
  "invalidCredentials": [
    {"email": "nonexistent@example.com", "password": "password123"},
    {"email": "test@example.com", "password": "wrongpassword"},
    {"email": "", "password": "password123"},
    {"email": "test@example.com", "password": ""}
  ],
  "securityTests": [
    {"email": "'; DROP TABLE users; --", "password": "password"},
    {"email": "<script>alert('xss')</script>", "password": "password"}
  ]
}
```

**Steps:**
1. **Login Form Display Validation:**
   - Navigate to /login page
   - Verify "Login" heading and instructions present
   - Verify email field with placeholder "you@example.com"
   - Verify password field masks input
   - Verify "Login" button present and clickable
   - Verify social media icons (Twitter, Facebook, LinkedIn) present
2. **Valid Authentication Testing:**
   - Enter validCredentials email and password
   - Click "Login" button
   - Verify authentication process response
   - Check for appropriate redirect or feedback
3. **Invalid Credentials Testing:**
   - For each set in invalidCredentials:
     - Enter the email and password combination
     - Click "Login" button  
     - Verify appropriate error message
     - Verify no unauthorized access granted
     - Verify form remains accessible for retry
4. **Form Validation Testing:**
   - Test empty email field submission
   - Test empty password field submission
   - Verify required field validation messages
5. **Security Testing:**
   - For each set in securityTests:
     - Enter the malicious input
     - Verify system handles input safely
     - Verify no code execution or injection occurs
6. **Social Media Integration:**
   - Click each social media icon
   - Verify appropriate action (redirect/popup/error)
   - Verify main login functionality remains intact
7. **Password Security Validation:**
   - Enter password and verify characters masked
   - Check password field type in browser tools
   - Verify password not visible in page source

**Expected Results:**
- Login form displays all required elements correctly
- Valid credentials authenticate successfully
- Invalid credentials rejected with generic error messages
- Empty fields prevented from submission with clear validation
- Security inputs handled safely without code execution
- Social media icons functional or show appropriate feedback
- Password field properly masks all input
- Form provides good user experience while maintaining security

---

## Test Case ID: TC-OPT-006

**Scenario Coverage:** TS-102, TS-103, TS-104, TS-105, TS-106, TS-107, TS-108, TS-109, TS-114, TS-117  
**Priority:** Medium  
**Type:** Cross-Browser  
**Role:** General User

**Description:** Cross-Browser Compatibility and Responsive Design

**Preconditions:**
- Multiple browsers available for testing
- Various screen sizes/devices available
- Network throttling tools available

**Test Data:**
```json
{
  "browsers": ["Chrome", "Firefox", "Safari", "Edge"],
  "screenSizes": [
    {"width": 1920, "height": 1080, "type": "Desktop"},
    {"width": 1366, "height": 768, "type": "Laptop"},
    {"width": 768, "height": 1024, "type": "Tablet"},
    {"width": 375, "height": 667, "type": "Mobile"}
  ],
  "keyFunctionalities": [
    "Navigation menu",
    "Product grid layout", 
    "Add to basket buttons",
    "Shopping cart display",
    "Checkout forms"
  ]
}
```

**Steps:**
1. **Cross-Browser Testing Loop:**
   - For each browser in browsers array:
     - Navigate to Sweet Shop website
     - Test all key functionalities
     - Verify visual layout consistency
     - Test JavaScript functionality
     - Document any browser-specific issues
2. **Responsive Design Testing:**
   - For each screen size in screenSizes:
     - Resize browser window or use device simulation
     - Navigate through all pages
     - Verify layout adapts appropriately
     - Test touch interactions (if applicable)
     - Verify text remains readable
3. **Performance Testing:**
   - Enable network throttling (slow 3G)
   - Measure page load times for each page
   - Verify functionality under slow network
   - Test image loading behavior
4. **Accessibility Testing:**
   - Test keyboard-only navigation
   - Check color contrast ratios
   - Verify screen reader compatibility
   - Test with browser zoom (150%, 200%)
5. **Error Handling:**
   - Test with JavaScript disabled (if possible)
   - Test with CSS loading failures
   - Test missing image handling

**Expected Results:**
- Website functions consistently across all tested browsers
- Layout adapts gracefully to different screen sizes
- All interactive elements remain functional on all devices
- Performance meets acceptable standards (< 5 seconds load time)
- Basic accessibility requirements are met
- Error conditions handled gracefully
- Core functionality works even with limited browser features

---

## Test Case ID: TC-OPT-007

**Scenario Coverage:** TS-006, TS-008, TS-009, TS-011, TS-014, TS-015  
**Priority:** High  
**Type:** Integration  
**Role:** General User

**Description:** Navigation Edge Cases, Footer Links, and Logo Behaviour

**Preconditions:**
- Sweet Shop website is accessible
- All static pages and footer elements rendered
- JavaScript enabled and history API working

**Test Data:**
```json
{
  "footerLinks": [
    {"name": "Twitter", "selector": "img[alt='twitter']"},
    {"name": "Facebook", "selector": "img[alt='facebook']"},
    {"name": "LinkedIn", "selector": "img[alt='linkedin']"}
  ],
  "invalidUrls": ["/nonexistent", "/sweets/999", "/login/admin", "/bout"],
  "logoSelector": ".navbar-brand img",
  "copyrightText": "Sweet Shop Project 2018"
}
```

**Steps:**
1. **Logo Click Behaviour:** From every page (Sweets, About, Login, Basket), click the Sweet Shop logo and verify return to Home (/).
2. **Footer Validation:** On every page, verify footer renders with copyright text and three social icons (Twitter, Facebook, LinkedIn).
3. **Footer Link Behaviour:** Click each social icon and verify it either navigates correctly or surfaces a placeholder href without breaking the page.
4. **Invalid URL Handling:** Visit each URL in invalidUrls and verify the application returns a 404 page or a graceful fallback (no crash, navigation still functional).
5. **Broken Link Detection:** Specifically test /bout (the malformed About link in the basket page nav) and confirm it is reported as a defect.
6. **Active Page Indicator Across Deep-link Refresh:** Navigate to each page via direct URL and verify the correct nav item is highlighted on first paint (not just after a click).
7. **Browser History Edge Cases:** Navigate Home → Sweets → Basket → Login, then use back/forward 4 times in each direction and verify state and URL match expectations at every step.

**Expected Results:**
- Logo returns user to Home from every page consistently
- Footer renders with all three social icons and copyright on every page
- Social icons either route correctly or fail safely without breaking the page
- Invalid URLs render a 404 / fallback view; nav remains functional
- /bout malformed link defect is reproducible and logged
- Active page indicator works on direct URL load, not just navigation clicks
- Browser history preserves state correctly across multi-step back/forward

---

## Test Case ID: TC-OPT-008

**Scenario Coverage:** TS-022, TS-023, TS-024, TS-025, TS-029, TS-030  
**Priority:** Medium  
**Type:** Data-Driven / Visual  
**Role:** General User

**Description:** Product Catalogue — Image Loading, Alt Text, Sorting, and Empty States

**Preconditions:**
- Sweets catalogue page is accessible
- Network throttling tool available for slow-network simulation
- Browser DevTools available for image inspection

**Test Data:**
```json
{
  "imageChecks": [
    {"product": "Chocolate Cups", "src": "img/cups.jpg", "altRequired": true},
    {"product": "Sherbert Straws", "src": "img/straw.JPG", "altRequired": true},
    {"product": "Bonbon", "src": "img/bonbon.jpg", "altRequired": true}
  ],
  "networkProfiles": ["Fast 3G", "Slow 3G", "Offline"],
  "expectedFallback": "broken-image icon OR alt text"
}
```

**Steps:**
1. **Image Source Validation:** For every product card, inspect the rendered image element and verify the src URL returns HTTP 200.
2. **Case Sensitivity Check:** Verify image paths are consistent in case (note straw.JPG vs straw.jpg — flag any case mismatch as a defect on case-sensitive servers).
3. **Alt Text Coverage:** Iterate every product card and assert each `<img>` has a non-empty, descriptive alt attribute. Flag products with missing or generic alt as accessibility defects.
4. **Lazy Loading:** Scroll the catalogue from top to bottom and verify images either load eagerly or use loading="lazy" without blocking the page.
5. **Slow Network Behaviour:** Apply Slow 3G throttling, reload the catalogue, and verify a placeholder or skeleton renders while images load (no layout shift).
6. **Broken Image Fallback:** In DevTools, block one image URL, reload, and verify the application shows alt text or a placeholder rather than a broken icon with no context.
7. **Empty Catalogue Simulation:** Use DevTools to override the product API/source to return an empty list and verify the page shows an empty-state message rather than a blank grid.
8. **Sort / Filter (if present):** If the page exposes sort or filter controls, verify each option produces an ordered, correct result set. If absent, log as feature gap.

**Expected Results:**
- All product image URLs return HTTP 200
- All `<img>` elements have meaningful alt text
- Slow networks do not cause layout shift; placeholders render
- Broken images degrade gracefully to alt text or placeholder
- Empty catalogue state shows a user-friendly message
- Image path case-sensitivity issues are flagged for fix

---

## Test Case ID: TC-OPT-009

**Scenario Coverage:** TS-040, TS-041, TS-042, TS-043, TS-045, TS-046, TS-049, TS-050  
**Priority:** High  
**Type:** Integration / Boundary  
**Role:** General User

**Description:** Shopping Cart — Quantity Limits, Boundary Pricing, Concurrency, and Persistence Edges

**Preconditions:**
- Catalogue and basket pages functional
- Browser supports localStorage / sessionStorage inspection
- Multiple browser tabs available for concurrency tests

**Test Data:**
```json
{
  "boundaryAdds": [
    {"product": "Bubbly", "price": 0.10, "quantity": 1, "expectedTotal": 0.10},
    {"product": "Bubbly", "price": 0.10, "quantity": 100, "expectedTotal": 10.00},
    {"product": "Swansea Mixture", "price": 1.50, "quantity": 999, "expectedTotal": 1498.50}
  ],
  "allProducts": "Add one of each of the 16 products",
  "expectedTotalAllProducts": 11.25
}
```

**Steps:**
1. **Add Single Item Multiple Times:** Click Add to Basket on the same product 10 times rapidly. Verify counter ends at 10 and total = 10 × price.
2. **Add One of Every Product:** Add one of each of the 16 products. Compute expected total (sum of all 16 prices = £11.25). Verify basket total matches to 2 decimal places.
3. **Maximum Quantity Boundary:** Attempt to add an item 999 times (or whatever the documented max is). Verify either the limit is enforced with a clear message or the cart accepts and totals correctly.
4. **Negative / Zero Quantity:** If quantity input exists, attempt to set quantity to 0 or a negative number and verify the input is rejected.
5. **Concurrent Tab Add:** Open the catalogue in two tabs. Add an item in tab A, switch to tab B, refresh, and verify the item is visible (or document the lack of multi-tab sync as a behaviour).
6. **Storage Persistence on Browser Restart:** Add items, fully close the browser, reopen, navigate to the basket, and verify behaviour matches the documented persistence model (session vs persistent).
7. **Storage Tampering:** In DevTools, manually edit the basket value in storage to an invalid shape. Reload and verify the application either recovers (resets to empty) or shows a clear error rather than crashing.
8. **Decimal Precision Stress:** Add combinations whose sums could trigger floating-point error (e.g., 0.10 + 0.20). Verify total displays as exactly 0.30, not 0.30000000004.

**Expected Results:**
- Adding the same item N times produces total = N × price exactly
- Sum across all 16 products equals £11.25 to 2 decimal places
- Quantity limits, if any, are documented and enforced clearly
- Negative or zero quantities are rejected
- Floating-point precision errors do not appear in the displayed total
- Tampered storage is recovered from gracefully — no crash
- Persistence behaviour across browser restart matches documented expectation

---

## Test Case ID: TC-OPT-010

**Scenario Coverage:** TS-061, TS-062, TS-063, TS-064, TS-065, TS-066, TS-067, TS-068, TS-069, TS-072, TS-073, TS-074  
**Priority:** High  
**Type:** Functional / Validation  
**Role:** General User

**Description:** Checkout — Field-Level Validation, Card Format, Address Edge Cases, Promo Combinations

**Preconditions:**
- Basket has at least one item
- Checkout form is fully rendered
- Test card numbers and invalid inputs prepared

**Test Data:**
```json
{
  "validCards": [
    {"type": "Visa", "number": "4111111111111111"},
    {"type": "Mastercard", "number": "5555555555554444"},
    {"type": "Amex", "number": "378282246310005"}
  ],
  "invalidExpiry": ["00/25", "13/25", "12/20", "12/99", "ab/cd"],
  "invalidCvv": ["12", "12345", "abc", ""],
  "longAddress": "A".repeat(500),
  "specialCharNames": ["O'Brien", "Anne-Marie", "  Trim  ", "<script>"],
  "promoCombinations": [
    {"code": "TEST10", "expectsValid": true},
    {"code": "test10", "expectsValid": true},
    {"code": "EXPIRED2020", "expectsValid": false},
    {"code": "", "expectsValid": false},
    {"code": "   ", "expectsValid": false}
  ]
}
```

**Steps:**
1. **Card Type Detection:** Enter each card number from validCards and verify the form recognises the brand (or, if no detection, verify all are accepted equally).
2. **Invalid Expiry:** For each value in invalidExpiry, attempt submission and verify a validation error appears.
3. **Invalid CVV:** For each value in invalidCvv, attempt submission and verify a validation error appears.
4. **Past Expiry Date:** Enter a past month/year combination and verify the form rejects it as expired.
5. **Address Length Limits:** Paste longAddress (500 chars) into Address line 1 and verify the input either truncates with a message or accepts the full value without breaking layout.
6. **Special Characters in Names:** Submit each value in specialCharNames as First Name and Last Name. Verify accepted characters (apostrophes, hyphens) work and that script-like inputs are sanitised.
7. **Whitespace Handling:** Submit names and email with leading/trailing spaces; verify they are trimmed before validation.
8. **Country–City Coupling:** Change the country selector and verify the city options update consistently. If only UK is supported, confirm Bristol/Cardiff/Swansea are the only valid options for it.
9. **Zip Code Format:** Enter UK postcodes in valid (BS1 1AA), invalid (12345), and edge (lowercase bs1 1aa, no space BS11AA) forms and verify validation behaviour.
10. **Promo Code Combinations:** For each entry in promoCombinations, redeem the code and verify the response matches expectsValid.
11. **Promo + Free Delivery:** Apply a promo code with the FREE Collect option selected and verify the total math (subtotal − discount + £0 shipping).
12. **Form Reset Behaviour:** Fill all fields, click Continue to checkout, then navigate back. Verify whether form retains data or resets — document the observed behaviour.

**Expected Results:**
- All valid card numbers are accepted; invalid card numbers are rejected with clear messages
- Expiry validation rejects past, malformed, and out-of-range values
- CVV validation enforces correct length and numeric-only input
- Long addresses do not break the layout
- Names with apostrophes and hyphens are accepted; script payloads are sanitised
- Whitespace in inputs is trimmed before validation
- Country and city selectors stay coupled correctly
- UK zip code validation accepts standard formats
- Promo code success/failure matches expected for every combination
- Promo + delivery interactions produce correct totals

---

## Test Case ID: TC-OPT-011

**Scenario Coverage:** TS-079, TS-086, TS-087, TS-090, TS-091, TS-092, TS-093, TS-094, TS-095, TS-096, TS-097, TS-098, TS-099, TS-100  
**Priority:** High  
**Type:** Security / Functional  
**Role:** General User

**Description:** Authentication — Session, Lockout, Password Reset, Brute-force, Concurrent Sessions

**Preconditions:**
- Login page accessible
- Storage and cookies inspectable via DevTools
- Multiple browsers / incognito windows available

**Test Data:**
```json
{
  "validUser": {"email": "test@example.com", "password": "password123"},
  "lockoutAttempts": 5,
  "passwordPolicy": {
    "min": 8,
    "requiresUpper": true,
    "requiresNumber": true,
    "requiresSpecial": true
  },
  "weakPasswords": ["123", "password", "abc123", "qwerty"],
  "longInputs": {"email": "a".repeat(500) + "@x.com", "password": "p".repeat(1000)}
}
```

**Steps:**
1. **Remember Me:** If a Remember Me toggle exists, login with it enabled, close the browser, reopen, and verify the session persists. Without it, verify the session does not persist.
2. **Logout Behaviour:** After login, perform logout and verify protected routes redirect to /login, the session token is cleared, and the back button does not restore the session.
3. **Session Timeout:** After login, leave the application idle for the documented timeout window. Confirm the user is logged out automatically and a clear message is shown.
4. **Concurrent Sessions:** Login as the same user in two browsers. Verify either both sessions remain valid (documented) or the second login invalidates the first (also documented).
5. **Password Reset Flow:** Click Forgot Password (if present). Submit a known email and verify a confirmation message appears. Submit an unknown email and verify the response does not leak whether the account exists.
6. **Account Lockout:** Submit incorrect credentials lockoutAttempts times in a row and verify the account is temporarily locked or rate-limited. Verify clear messaging.
7. **Brute Force Throttling:** Send 20 rapid login requests and verify the server rate-limits or shows CAPTCHA-style challenge.
8. **Password Policy Enforcement:** On registration / change password (if available), test each password in weakPasswords and confirm rejection with policy reason.
9. **Long Input Handling:** Submit longInputs.email and longInputs.password and verify the form rejects oversize inputs or handles them safely without crash.
10. **Case Sensitivity of Email:** Login with capitalised email (TEST@EXAMPLE.COM) and verify it is treated case-insensitively per RFC 5321.
11. **Trailing Whitespace in Credentials:** Submit email and password with trailing spaces and verify behaviour matches documented expectation.
12. **Token / Cookie Security:** Inspect auth cookies post-login and verify they have HttpOnly and Secure flags set. Flag missing flags as security defects.
13. **CSRF Protection:** Inspect the login POST request for a CSRF token (or SameSite cookie protection). Document if absent.
14. **Logout from Inactive Tab:** Login in tab A and tab B, logout in tab A, then attempt an action in tab B. Verify tab B detects the logout cleanly.

**Expected Results:**
- Remember Me behaviour matches its documented contract
- Logout fully clears session; protected routes are unreachable post-logout
- Idle sessions expire as documented
- Concurrent session behaviour is consistent with policy
- Password reset does not leak account existence
- Account lockout activates at the configured threshold
- Brute-force attempts are throttled or challenged
- Weak passwords rejected with explicit reason
- Email is treated case-insensitively
- Auth cookies carry HttpOnly and Secure flags
- CSRF protection is in place or its absence is logged as a defect

---

## Test Case ID: TC-OPT-012

**Scenario Coverage:** TS-101, TS-110, TS-111, TS-112, TS-113, TS-115, TS-116, TS-118, TS-119, TS-120, TS-121, TS-122, TS-123, TS-124, TS-125  
**Priority:** Medium  
**Type:** Accessibility / Performance / Visual  
**Role:** General User

**Description:** UI / Usability — Accessibility, Performance, Visual Polish, Error States

**Preconditions:**
- axe-core or equivalent accessibility scanner available
- Lighthouse or Web Vitals tooling available
- Screen reader available (NVDA / VoiceOver / TalkBack)
- Multiple OS / browser combinations available

**Test Data:**
```json
{
  "wcagTargets": {
    "contrastRatio": 4.5,
    "lighthouseAccessibility": 90,
    "lighthousePerformance": 80,
    "lcp": 2500,
    "cls": 0.1
  },
  "pages": ["/", "/sweets", "/about", "/login", "/basket"],
  "viewports": [320, 375, 768, 1024, 1440, 1920],
  "zoomLevels": [100, 150, 200, 400]
}
```

**Steps:**
1. **Automated Accessibility Scan:** Run axe-core on every page in the pages list. Record violation count by impact (critical, serious, moderate, minor). Fail the test on any critical or serious finding.
2. **Keyboard-Only Navigation:** For each page, traverse the entire interactive surface using Tab and Shift+Tab. Verify every interactive element is reachable and the focus indicator is visible at every step.
3. **Skip Links:** Verify a "Skip to main content" link is exposed on first Tab press for keyboard users. If absent, log as defect.
4. **Screen Reader Announcement:** Navigate the catalogue with a screen reader and verify each product card announces name, price, and the Add to Basket action coherently.
5. **Form Label Association:** For Login and Checkout forms, verify every input has a programmatically associated `<label>`. Inputs using only placeholder text are flagged as defects.
6. **Color Contrast:** Sample primary text, button text, link text, and error text on every page. Verify each meets wcagTargets.contrastRatio (4.5:1 for normal text).
7. **Zoom Resilience:** For each zoom level, verify content reflows correctly with no horizontal scroll up to 200%, and remains usable at 400%.
8. **Viewport Reflow:** For each viewport width, verify navigation collapses appropriately, product grid reflows, and no element overflows or is clipped.
9. **Lighthouse Audit:** Run Lighthouse on each page and record Performance, Accessibility, Best Practices, and SEO scores. Fail if Performance < 80 or Accessibility < 90.
10. **Core Web Vitals:** Measure LCP, CLS, and INP on Home, Sweets, and Basket. Fail if LCP > 2.5s or CLS > 0.1.
11. **Error Page UX:** Trigger 404 (visit a bad URL) and verify the page provides a clear message and a path back to a working page.
12. **Loading and Empty States:** Verify every async area shows a loading indicator while pending and a meaningful empty state when no data is available.
13. **Animations and Motion:** If animations are present, verify prefers-reduced-motion is respected. If not respected, log as accessibility defect.
14. **Print Styles:** Trigger Ctrl+P on Basket and Checkout pages and verify the print preview shows readable, paginated content (no nav or footer noise).
15. **Browser Console Cleanliness:** For every page, verify the browser console shows no errors and no warnings. Each console error is logged as a defect.

**Expected Results:**
- Zero critical or serious axe violations on any page
- All interactive elements reachable via keyboard with visible focus
- Screen reader announces all key UI coherently
- Form labels are programmatically associated with inputs
- All text meets WCAG AA contrast ratios
- Layout stays usable at zoom 200% and below; no horizontal scroll
- Layout reflows correctly across viewports 320–1920 px
- Lighthouse Performance ≥ 80, Accessibility ≥ 90 on every page
- LCP ≤ 2.5s and CLS ≤ 0.1 on key pages
- 404 page is informative; loading and empty states are present
- prefers-reduced-motion respected; print styles produce clean output
- No console errors or warnings on any page

---

## Coverage Summary

### Complete Scenario Mapping
- **Navigation (TS-001 to TS-015):** Covered by TC-OPT-001, TC-OPT-007
- **Product Catalog (TS-016 to TS-030):** Covered by TC-OPT-002, TC-OPT-008
- **Shopping Cart (TS-031 to TS-050):** Covered by TC-OPT-003, TC-OPT-009
- **Checkout (TS-051 to TS-075):** Covered by TC-OPT-004, TC-OPT-010
- **Authentication (TS-076 to TS-100):** Covered by TC-OPT-005, TC-OPT-011
- **UI/Usability (TS-101 to TS-125):** Covered by TC-OPT-006, TC-OPT-012

### Optimization Benefits
- **Reduced Test Cases:** From 125 scenarios to 12 comprehensive test cases
- **Improved Efficiency:** Data-driven approach eliminates redundancy
- **Enhanced Coverage:** Integration tests cover cross-module scenarios
- **Better Maintainability:** Consolidated test data and validation logic
- **Automation Ready:** Structured for easy Playwright implementation

### Execution Strategy
- **Smoke Testing:** TC-OPT-001 + TC-OPT-003 (core navigation and cart)
- **Regression Testing:** All 12 optimized test cases
- **Security Testing:** TC-OPT-005 + TC-OPT-011 focused execution
- **Cross-browser Testing:** TC-OPT-006 + TC-OPT-012 with browser matrix
- **Edge Case Testing:** TC-OPT-007, TC-OPT-008, TC-OPT-009, TC-OPT-010

This optimized approach provides complete coverage of all 125 scenarios while dramatically reducing execution time and maintenance overhead.