export class BrokerDetailsPage {
    getPhoneNumbers() {
      return cy.get('.MuiGrid-root .MuiStack-root a');
    }
  }
  
  export const brokerDetailsPage = new BrokerDetailsPage();
  