const loginPageUrl = 'https://www.instagram.com/accounts/login/';

const loginPage = async (page, config) => {
  console.log(`Redirect to: ${loginPageUrl}`);
  await page.goto(loginPageUrl);
  await page.waitForSelector('form[method="post"]');
  await page.type('[name="username"]', config.username);
  await page.type('[name="password"]', config.password);
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
};

module.exports = (browser, config) => async () => {
  const loginPageHandler = await browser.newPage();
  await loginPage(loginPageHandler, config);
  loginPageHandler.close();
};
