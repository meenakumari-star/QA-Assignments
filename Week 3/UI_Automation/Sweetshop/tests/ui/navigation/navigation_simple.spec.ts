import { test, expect } from '@fixtures/pageFixtures';
import { expectedProductCount } from '../../../data/testData';

test.describe('Feature: Navigation Flow', () => {

  /**
   * Test Case: TC-NAV-001
   * Description: Basic homepage navigation and logo verification
   * Steps: Navigate to homepage and verify logo is visible
   * Expected: Logo is visible and clickable
   */
  test('TC-NAV-001: should display logo and navigate to homepage @critical @ui', async ({ 
    page, homePage 
  }) => {
    await homePage.navigateToHomePage();
    await homePage.verifyTitle();
    
    const logoVisible = await homePage.isLogoVisible();
    expect(logoVisible).toBe(true);
  });

  /**
   * Test Case: TC-NAV-002
   * Description: Main navigation menu functionality
   * Steps: Test all main navigation links work
   * Expected: All navigation links navigate to correct pages
   */
  test('TC-NAV-002: should navigate between main sections @critical @ui', async ({ 
    page, homePage, sweetsPage, basketPage 
  }) => {
    // Start at home
    await homePage.navigateToHomePage();
    await expect(page).toHaveURL(/.*\/$/);
    
    // Navigate to sweets
    await homePage.navigateToSweets();
    await expect(page).toHaveURL(/.*\/sweets/);
    
    // Navigate to basket
    await basketPage.navigateToBasket();
    await expect(page).toHaveURL(/.*\/basket/);
  });
});