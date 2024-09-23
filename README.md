Kin and Carta - Broker Test Automation
This repo is specific for a task assignment from my lead Edison Bajrami

Prerequisites
Ensure you have the following installed on your system:
Node.js (version 12 or later)
npm or yarn
Setup
Clone this repository

Install Cypress and dependencies:

If you're using npm:

npm install

If you're using yarn:

yarn install


Install the necessary package for generating the Excel report:

npm install cypress xlsx --save-dev


Test Scenario
The script automates the following scenario on the Yavlena brokers' page:
Scraping Broker Data:
The script dynamically scrolls through the broker list on the Yavlena broker page.
It scrapes and stores the names of brokers in a JSON file.
Verifying Broker Details:
For each broker, the script searches by name, ensures only one broker is displayed, and retrieves:
The number of properties
The address
Landline and mobile phone numbers
Excel Report Generation:
The broker data is saved incrementally to a JSON file.
After all data is scraped and verified, the script generates an Excel report containing the broker details.
Running the Tests
You can run the tests using the Cypress Test Runner (GUI) or headless mode:
Cypress Test Runner (GUI):


npx cypress open
This will open the Cypress Test Runner.
Select the test file searchBrokers.spec.cy.js to run the test.


Test File
Test file name: searchBrokers.spec.cy.js
This test dynamically scrapes and verifies broker details, saves them to a JSON file, and generates an Excel report.


Excel Report Generation
At the end of the test, an Excel report containing broker details is generated and saved in the cypress/reports directory.

Report Generation Command
The Excel report is generated during the test using the following task in the cypress.config.js file:

cy.task('generateReport', brokers).then(() => {
  cy.log('Excel report generated successfully');
});

This task leverages the xlsx package to create and write the broker data to an Excel file. The Excel report will be located at:

cypress/reports/brokers_report.xlsx


Conclusion
This script automates the process of scraping, verifying, and reporting real estate broker details on the Yavlena website. The final output is stored in both a JSON and Excel report format for easy review.

If you have any questions or need further clarification, feel free to contact me.
Thank you in advance
