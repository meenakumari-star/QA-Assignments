// Test data constants and interfaces for Sweet Shop testing

import sweetsData from './sweets.json';
import userData from './users.json';

// Product count constant
export const expectedProductCount = 16;

// Navigation interfaces and data
export interface NavigationPage {
  name: string;
  url: string;
  element: string;
}

export const navigationPages: NavigationPage[] = [
  { name: "Home", url: "/", element: "Sweet Shop logo" },
  { name: "Sweets", url: "/sweets", element: "Sweets link" },
  { name: "About", url: "/about", element: "About link" },
  { name: "Login", url: "/login", element: "Login link" },
  { name: "Basket", url: "/basket", element: "Basket link" }
];

// Product and cart operation interfaces
export interface CartOperation {
  action: 'add' | 'remove' | 'empty';
  product?: string;
  price?: number;
  expectedCount: number;
  expectedTotal: number;
}

export interface Product {
  name: string;
  price: string;
  numericPrice: number;
  description: string;
}

// Import data from JSON files
export const products = sweetsData.products;
export const cartOperations = sweetsData.cartOperations;
export const validUser = userData.validUser;
export const invalidUsers = userData.invalidUsers;
export const checkoutData = userData.checkoutData;

// Delivery options
export const deliveryOptions = {
  collect: { name: "Collect (FREE)", price: 0 },
  shipping: { name: "Standard Shipping (£1.99)", price: 1.99 }
};

// Test URLs
export const testUrls = {
  base: "https://sweetshop.netlify.app",
  home: "/",
  sweets: "/sweets",
  about: "/about", 
  login: "/login",
  basket: "/basket"
};

// Test viewports for responsive testing
export const testViewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
  widescreen: { width: 1920, height: 1080 }
};

// Browser configurations
export const browsersList = [
  'chromium',
  'firefox', 
  'webkit'
];