/* eslint-disable no-console */
process.env.NODE_ENV = 'test';

require('../config/env').config();

const Mocha = require('mocha');
const chalk = require('chalk');
const paths = require('../config/paths');
const glob = require('glob');
const fixtures = require('pow-mongodb-fixtures').connect(process.env.MONGODB_URI);
const chai = require('chai');
const sinonChai = require('sinon-chai');
const startServer = require('../api/index');

require('chai/register-expect');

chai.use(sinonChai);

// Instantiate a Mocha instance.
const mocha = new Mocha({ timeout: 3000 });

const fileName = process.argv.slice(2)[0];

const fileExp = fileName ? `test/**/${fileName}.js` : 'test/**/*.js';

const beforeAll = async () => {
  const [mongoConnection, server] = await startServer();
  global.testingMongoConnection = mongoConnection;
  global.testingServer = server;
  console.log('Globals setup!');
};

const afterAll = () => {
  global.testingServer.close();
  global.testingMongoConnection.close();
  console.log('Globals closed!');
};

const runTests = async () => {
  await beforeAll();

  mocha
    .run((failures) => {
      process.on('exit', () => {
        afterAll();
        fixtures.clear();
        process.exit(failures); // exit with non-zero status if there were failures
      });
    })
    .on('end', () => {
      process.exit();
    });
};

fixtures.clearAllAndLoad(paths.fixtures, () => {
  console.log(chalk.cyan('✨  Test database loaded'));

  // Add each .js file to the mocha instance
  glob(fileExp, { realpath: true, ignore: 'test/fixtures/**' }, (err, files) => {
    files.forEach(file => mocha.addFile(file));

    // Run the tests.
    runTests();
  });
});
