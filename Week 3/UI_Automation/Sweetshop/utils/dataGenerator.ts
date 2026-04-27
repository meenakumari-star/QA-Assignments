import { faker } from '@faker-js/faker';

export interface GeneratedUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface GeneratedBilling {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  address2?: string;
  country: string;
  city: string;
  zip: string;
}

export class DataGenerator {
  static generateUser(): GeneratedUser {
    return {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 8, memorable: true }),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName()
    };
  }

  static generateBillingData(): GeneratedBilling {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      address: faker.location.streetAddress(),
      address2: faker.location.secondaryAddress(),
      country: 'United Kingdom',
      city: faker.helpers.arrayElement(['Bristol', 'Cardiff', 'Swansea']),
      zip: faker.location.zipCode('??# #??')
    };
  }

  static generateValidCreditCard(): string {
    // Generate a valid Luhn algorithm credit card number (test number)
    return '4111111111111111'; // Visa test card
  }

  static generatePromoCode(length: number = 6): string {
    return faker.string.alphanumeric({ length, casing: 'upper' });
  }

  static generateProductName(): string {
    const adjectives = ['Sweet', 'Candy', 'Chocolate', 'Fruity', 'Chewy'];
    const nouns = ['Treats', 'Delights', 'Bites', 'Chews', 'Drops'];
    
    return `${faker.helpers.arrayElement(adjectives)} ${faker.helpers.arrayElement(nouns)}`;
  }

  static generatePrice(min: number = 0.10, max: number = 2.00): number {
    return Math.round(faker.number.float({ min, max }) * 100) / 100;
  }
}