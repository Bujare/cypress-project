export class SearchBrokerPage {
    getSearchInput() {
      return cy.get('#broker-keyword');
    }
  
    getSearchButton() {
      return cy.get('.MuiButton-textDarkBlue');
    }
  }
  
  export const searchBrokerPage = new SearchBrokerPage();
  
  