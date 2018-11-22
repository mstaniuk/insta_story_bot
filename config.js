function getConfig(env) {
  return {
    users: env.USERS,
    username: env.USERNAME,
    password: env.PASSWORD,
    downloadDir: './media',
    browserSettings: {
      // headless: false,
    },
  };
}

module.exports = getConfig;

