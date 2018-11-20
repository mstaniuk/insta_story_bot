function getConfig(argv) {
  return {
    users: argv._,
    username: argv.u,
    password: argv.p,
    downloadDir: './media',
    browserSettings: {
      // headless: false,
    },
  };
}

module.exports = getConfig;

