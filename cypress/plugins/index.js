const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

module.exports = (on, config) => {
  on('task', {
    log(message) {
      console.log(message);
      return null;
    },
    failTest(message) {
      throw new Error(message);
    }
  });
};

