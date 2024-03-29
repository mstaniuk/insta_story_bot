const envConfig = require('./.env');
const configFactory = require('./config.js');
const asyncBrowserFactory = require('./browser.js');
const loginPageFactory = require('./loginPage.js');
const userPageFactory = require('./userPage.js');

(async (env) => {
  const config = configFactory(env);
  const browser = await asyncBrowserFactory(config.browserSettings);

  const loginPageAction = loginPageFactory(browser, config);
  const userPageAction = userPageFactory(browser, config);

  while (true) {
    // Go through login page
    await loginPageAction();

    // Loop over user pages
    while (true) {
      try {
        const userPages = config.users.map(username => userPageAction(username));
        await Promise.all(userPages);

      } catch (e) {
        break;
      }
    }
  }
})(envConfig);
