const { defineConfig } = require("cypress");

const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.yavlena.com/en/',
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        failTest(message) {
          throw new Error(message);
        },
        generateReport(brokers) {
          brokers = brokers.map((broker) => {
            const result = (broker.name !== 'N/A' && broker.properties !== 'N/A' && broker.address !== 'N/A' && broker.landline !== 'N/A' && broker.mobile !== 'N/A') 
              ? 'Passed' : 'Failed (Not all infos present';
            return { ...broker, result };
          });
          const reportsDir = path.join(__dirname, 'cypress/reports');
          if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
          }

          const wb = xlsx.utils.book_new();
          const ws = xlsx.utils.json_to_sheet(brokers);
          const headers = {
            A1: { t: 's', v: 'NAME' },
            B1: { t: 's', v: 'PROPERTIES' },
            C1: { t: 's', v: 'ADDRESS' },
            D1: { t: 's', v: 'LANDLINE' },
            E1: { t: 's', v: 'MOBILE' },
            F1: { t: 's', v: 'RESULT' }
          };
          Object.assign(ws, headers);
          ws['!cols'] = [
            { wch: 20 }, // Name
            { wch: 30 }, // Properties
            { wch: 30 }, // Address
            { wch: 20 }, // Landline
            { wch: 20 }, // Mobile
            { wch: 15 }, // Result
          ];

          xlsx.utils.book_append_sheet(wb, ws, 'Brokers Report');
          const reportPath = path.join(reportsDir, 'brokers_report.xlsx');
          xlsx.writeFile(wb, reportPath);

          console.log(`Excel report generated at ${reportPath}`);
          return null;
        }
      });
    },
  },
});