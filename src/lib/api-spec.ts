/**
 * API Specification
 * Base URL: http://localhost:8080
 * 
 * This file documents the external API endpoints that this UI connects to.
 * Source: http://localhost:8080/api-docs
 */

export interface Brand {
  id?: string;
  name: string;
  url: string;
}

export interface ApiSpec {
  customers: {
    create: {
      method: 'POST';
      path: '/api/customers/create';
      request: {
        organisationName: string;
        customerId: string;
        brands: Array<{
          name: string;
          url: string;
        }>;
      };
      response: {
        id: string;
        organisationName: string;
        customerId: string;
        brands: Array<{
          id: string;
          name: string;
          url: string;
        }>;
      };
    };
    getAll: {
      method: 'GET';
      path: '/api/customers';
      response: Array<{
        id: string;
        organisationName: string;
        customerId: string;
        brands: Array<{
          id: string;
          name: string;
          url: string;
        }>;
      }>;
    };
    // Add other endpoints...
  };
} 