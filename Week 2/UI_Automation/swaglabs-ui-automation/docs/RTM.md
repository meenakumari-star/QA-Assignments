# Requirements Traceability Matrix (RTM)
## Swag Labs — UI Automation Suite

| Req ID  | Requirement Description                                             | Test Case(s)                                  | Automation File          | Status     |
|---------|---------------------------------------------------------------------|-----------------------------------------------|--------------------------|------------|
| FR-1.1  | Standard user can log in                                            | TC_LOGIN_001                                  | tests/login.spec.ts      | Automated  |
| FR-1.2  | Locked-out user is blocked with error                               | TC_LOGIN_002                                  | tests/login.spec.ts      | Automated  |
| FR-1.3  | Invalid credentials rejected                                        | TC_LOGIN_003                                  | tests/login.spec.ts      | Automated  |
| FR-1.4  | Empty username field error                                          | TC_LOGIN_004                                  | tests/login.spec.ts      | Automated  |
| FR-1.5  | Empty password field error                                          | TC_LOGIN_005                                  | tests/login.spec.ts      | Automated  |
| FR-1.6  | Problem user can log in                                             | TC_LOGIN_006                                  | tests/login.spec.ts      | Automated  |
| FR-1.7  | Performance glitch user can log in                                  | TC_LOGIN_007                                  | tests/login.spec.ts      | Automated  |
| FR-1.8  | Logout returns user to login                                        | TC_LOGIN_008                                  | tests/login.spec.ts      | Automated  |
| FR-2.1  | Inventory renders 6 products                                        | TC_INV_001                                    | tests/inventory.spec.ts  | Automated  |
| FR-2.2  | Sort A → Z                                                          | TC_INV_002                                    | tests/inventory.spec.ts  | Automated  |
| FR-2.3  | Sort Z → A                                                          | TC_INV_003                                    | tests/inventory.spec.ts  | Automated  |
| FR-2.4  | Sort low → high price                                               | TC_INV_004                                    | tests/inventory.spec.ts  | Automated  |
| FR-2.5  | Sort high → low price                                               | TC_INV_005                                    | tests/inventory.spec.ts  | Automated  |
| FR-2.6  | Add single item from inventory                                      | TC_INV_006                                    | tests/inventory.spec.ts  | Automated  |
| FR-2.7  | Add multiple items from inventory                                   | TC_INV_007                                    | tests/inventory.spec.ts  | Automated  |
| FR-2.8  | Remove item from inventory                                          | TC_INV_008                                    | tests/inventory.spec.ts  | Automated  |
| FR-2.9  | Reset App State clears cart                                         | TC_INV_009                                    | tests/inventory.spec.ts  | Automated  |
| FR-3.1  | Cart shows items added                                              | TC_CART_001                                   | tests/cart.spec.ts       | Automated  |
| FR-3.2  | Remove item from cart                                               | TC_CART_002                                   | tests/cart.spec.ts       | Automated  |
| FR-3.3  | Continue shopping returns to inventory                              | TC_CART_003                                   | tests/cart.spec.ts       | Automated  |
| FR-3.4  | Empty cart navigation behavior                                      | TC_CART_004                                   | tests/cart.spec.ts       | Automated  |
| FR-3.5  | Cart persists across reload                                         | TC_CART_005                                   | tests/cart.spec.ts       | Automated  |
| FR-4.1  | Complete checkout end to end (subtotal + tax = total)               | TC_CHK_001                                    | tests/checkout.spec.ts   | Automated  |
| FR-4.2  | Missing first name validation                                       | TC_CHK_002                                    | tests/checkout.spec.ts   | Automated  |
| FR-4.3  | Missing last name validation                                        | TC_CHK_003                                    | tests/checkout.spec.ts   | Automated  |
| FR-4.4  | Missing postal code validation                                      | TC_CHK_004                                    | tests/checkout.spec.ts   | Automated  |
| FR-4.5  | Back to products from completion page                               | TC_CHK_005                                    | tests/checkout.spec.ts   | Automated  |

**Coverage summary**

| Module    | Requirements | Test Cases | Automated | Coverage |
|-----------|--------------|------------|-----------|----------|
| Login     | 8            | 8          | 8         | 100%     |
| Inventory | 9            | 9          | 9         | 100%     |
| Cart      | 5            | 5          | 5         | 100%     |
| Checkout  | 5            | 5          | 5         | 100%     |
| **Total** | **27**       | **27**     | **27**    | **100%** |
