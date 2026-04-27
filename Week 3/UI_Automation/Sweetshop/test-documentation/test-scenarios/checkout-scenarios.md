# Checkout Scenarios - Sweet Shop

### Feature Name: Checkout Process

| Scenario ID | Scenario Title | Scenario Description | Type | Priority |
|-------------|----------------|----------------------|------|----------|
| TS-051 | Delivery Option Selection | User selects between Collect (FREE) and Standard Shipping options | Positive | High |
| TS-052 | Promo Code Application | User enters and applies valid promo code | Positive | High |
| TS-053 | Billing Address Form Completion | User fills out complete billing address information | Positive | High |
| TS-054 | Payment Information Entry | User enters valid payment details | Positive | High |
| TS-055 | Complete Checkout Process | User completes entire checkout from cart to payment | Positive | High |
| TS-056 | Country Selection Dropdown | User selects United Kingdom from country dropdown | Positive | High |
| TS-057 | City Selection Dropdown | User selects city from available options (Bristol, Cardiff, Swansea) | Positive | High |
| TS-058 | Required Field Validation | System validates all required fields before checkout | Positive | High |
| TS-059 | Email Format Validation | System validates email address format | Positive | High |
| TS-060 | Credit Card Number Validation | System validates credit card number format | Positive | High |
| TS-061 | CVV Field Validation | System validates CVV number input | Positive | High |
| TS-062 | Expiration Date Validation | System validates card expiration date | Positive | High |
| TS-063 | Invalid Promo Code | User enters invalid or expired promo code | Negative | Medium |
| TS-064 | Empty Required Fields | User attempts checkout with empty required fields | Negative | High |
| TS-065 | Invalid Email Format | User enters malformed email address | Negative | High |
| TS-066 | Invalid Credit Card Format | User enters invalid credit card number | Negative | High |
| TS-067 | Expired Credit Card | User enters expired credit card information | Negative | Medium |
| TS-068 | Invalid CVV | User enters invalid CVV number | Negative | Medium |
| TS-069 | Checkout with Empty Cart | User attempts checkout with no items in cart | Negative | High |
| TS-070 | Address Field Length Limits | Test maximum character limits for address fields | Boundary | Medium |
| TS-071 | Special Characters in Name | User enters special characters in name fields | Edge | Medium |
| TS-072 | Checkout Session Timeout | Checkout process after extended idle time | Edge | Low |
| TS-073 | Multiple Promo Code Attempts | User tries multiple promo codes sequentially | Edge | Medium |
| TS-074 | Checkout Form Accessibility | Checkout form is accessible via keyboard navigation | Positive | Low |
| TS-075 | Shipping Cost Calculation | Verify shipping cost is calculated correctly | Positive | High |