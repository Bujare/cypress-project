import { searchBrokerPage } from '../support/pages/searchBrokerPage';
import { brokerDetailsPage } from '../support/pages/brokerDetailsPage';

describe('Broker Search Test with Gradual Scrolling, Saving, and Verification', () => {
  let brokers = [];
  let brokerNamesScraped = new Set();
  let lastBrokerCount = 0;
  
Cypress.on('uncaught:exception', (err, runnable) => {
    return false; 
});
beforeEach(() => {
    cy.intercept('POST', 'https://q.clarity.ms/collect', { statusCode: 200 });
    cy.clearLocalStorage();
    cy.clearCookies();
});
before(() => {
  cy.visit('https://www.yavlena.com/en/broker?city=Sofia');
  cy.wait(5000);

  cy.get('button.MuiButtonBase-root').contains('Understood').click({ force: true });
  cy.wait(1000); 
});
function scrapeBrokerNames() {
    cy.wait(1000); 
    cy.get('.MuiGrid-item').each(($el) => {
      const name = $el.find('h6').text();
      const broker = {
        name: name || 'N/A',
        properties: 'N/A',
        address: 'N/A',
        landline: 'N/A',
        mobile: 'N/A',
      };
      if (!brokerNamesScraped.has(broker.name)) {
        brokers.push(broker);
        brokerNamesScraped.add(broker.name);
      }
    });
    cy.writeFile('cypress/fixtures/scrapedBrokers.json', brokers).then(() => {
      cy.log('Brokers incrementally saved.');
      cy.wait(1000); 
    });
  }
function gradualScrollAndScrapeNames() {
    cy.get('.MuiGrid-item').then(($els) => {
      const brokerCount = $els.length;

      if (brokerCount > lastBrokerCount) {
        lastBrokerCount = brokerCount;
        scrapeBrokerNames();
        cy.window().then((win) => {
          win.scrollBy(0, 500);
        });
        cy.wait(1000);
        gradualScrollAndScrapeNames(); 
        cy.wait(1000);
      } else {
        cy.log('All brokers scraped, starting verification.');
        verifyAndFetchBrokerDetails();
      }
    });
  }
function verifyAndFetchBrokerDetails() {
    cy.wait(1000); 
    brokers.forEach((broker) => {
      cy.log(`Searching for broker: ${broker.name}`);
      cy.wait(1000);
      cy.get('body').then(() => {
        searchBrokerPage.getSearchInput()
          .should('exist')         
          .should('be.visible')    
          .should('not.be.disabled')
          .should('have.attr', 'placeholder', 'Name...');
      cy.wait(1000);         
        searchBrokerPage.getSearchInput().focus().clear(); 
        cy.wait(500); 
        searchBrokerPage.getSearchInput().should('have.value', ''); 
        searchBrokerPage.getSearchInput().type(broker.name, { force: true }); 
        cy.wait(1000); 
      });
      cy.get('.MuiGrid-item').then(($els) => {
        if ($els.length > 1) {
          cy.log(`Found multiple results for broker: ${broker.name}. Retrying...`);
          searchBrokerPage.getSearchInput().clear().type(`${broker.name}`, { force: true });
          cy.wait(2000);
        } else if ($els.length === 0) {
          cy.log(`No brokers found for: ${broker.name}. Retrying with a delay...`);
          cy.wait(1000); 
          searchBrokerPage.getSearchInput().clear().type(`${broker.name}`, { force: true });
        }

      cy.get('.MuiGrid-item').should('have.length', 1); 
      });
      cy.wait(2000);
      cy.get('.MuiButton-textDarkBlue')
        .should('exist')       
        .should('be.visible')   
        .should('not.be.disabled') 
        .click({ force: true });
        cy.wait(1000); 
      
      cy.get('a.MuiTypography-root.MuiTypography-inherit.MuiLink-root.MuiLink-underlineHover')
        .invoke('text')
        .then((text) => {
          const propertiesMatch = text.match(/\d+\sproperties/);
          broker.properties = propertiesMatch ? propertiesMatch[0].trim() : 'N/A';
        });

      cy.get('span.MuiTypography-root.MuiTypography-textSmallRegular.mui-style-14x3no9')
        .invoke('text')
        .then((address) => {
          broker.address = address.trim();
        });

      cy.get('.MuiGrid-root .MuiStack-root a[href^="tel"]').then(($els) => {
        if ($els.length > 0) {
          broker.landline = $els.eq(0).text().trim() || 'N/A';
          broker.mobile = $els.eq(1).text().trim() || 'N/A';
        }
      });
      cy.wait(1000); 
      cy.writeFile('cypress/fixtures/scrapedBrokers.json', brokers); 
    });

      cy.task('generateReport', brokers).then(() => {
      cy.wait(1000); 

      cy.log('Excel report generated successfully');
    });
  }
it('Should scrape broker names first, update details, and save everything to JSON and Excel', () => {
    cy.wait(1000); 
    gradualScrollAndScrapeNames();
  });
});
