export const Users = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  lockedOut: { username: 'locked_out_user', password: 'secret_sauce' },
  problem: { username: 'problem_user', password: 'secret_sauce' },
  performance: { username: 'performance_glitch_user', password: 'secret_sauce' },
  error: { username: 'error_user', password: 'secret_sauce' },
  visual: { username: 'visual_user', password: 'secret_sauce' },
  invalid: { username: 'invalid_user', password: 'wrong_pass' },
} as const;

export const Products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTshirt: 'Sauce Labs Bolt T-Shirt',
  fleeceJacket: 'Sauce Labs Fleece Jacket',
  onesie: 'Sauce Labs Onesie',
  redTshirt: 'Test.allTheThings() T-Shirt (Red)',
} as const;

export const CheckoutInfo = {
  valid: { firstName: 'John', lastName: 'Doe', postalCode: '500001' },
  emptyFirstName: { firstName: '', lastName: 'Doe', postalCode: '500001' },
  emptyLastName: { firstName: 'John', lastName: '', postalCode: '500001' },
  emptyPostal: { firstName: 'John', lastName: 'Doe', postalCode: '' },
} as const;

export const ErrorMessages = {
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  badCredentials: 'Epic sadface: Username and password do not match any user in this service',
  emptyUsername: 'Epic sadface: Username is required',
  emptyPassword: 'Epic sadface: Password is required',
  emptyFirstName: 'Error: First Name is required',
  emptyLastName: 'Error: Last Name is required',
  emptyPostal: 'Error: Postal Code is required',
} as const;
