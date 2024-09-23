Cypress.Commands.add('checkBrokerDetails', (broker) => {
    Cypress.Commands.add('loginAndVisitPage', () => {
      cy.session('session-name', () => {
        cy.visit('https://www.yavlena.com/en/broker?city=Sofia'); 
      });
    });
  
    cy.get('.MuiGrid-root .MuiCardContent-root h6')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).to.contain(broker.name.trim());
      });
  
    cy.get('a[href^="/en/broker/"]')
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
  
    if (broker.mobile && broker.mobile !== 'N/A') {
      cy.get('.MuiGrid-root .MuiStack-root a[href^="tel"]')
        .eq(0)
        .should('exist')
        .invoke('text')
        .then((text) => {
          expect(text.trim()).to.contain(broker.mobile.trim());
        });
    } else {
      cy.log(`Broker ${broker.name} does not have a mobile number.`);
    }
  
    if (broker.landline && broker.landline !== 'N/A') {
      cy.get('.MuiGrid-root .MuiStack-root a[href^="tel"]')
        .eq(1)
        .should('exist')
        .invoke('text')
        .then((text) => {
          expect(text.trim()).to.contain(broker.landline.trim());
        });
    } else {
      cy.log(`Broker ${broker.name} does not have a landline number.`);
    }
  });
  
  