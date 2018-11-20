const _ = require('lodash');
const fs = require('fs');
const mkdirp = require('mkdirp');

const downloadUtils = require('./download.js');

const getUserPageByUsername = (username) => `https://www.instagram.com/${username}`;

const storiesButtonSelector = '#react-root > section > main > div > header > div > div > span > img';
const modalSelector = '#react-root > section > div > div > section';
const modalNextButtonSelector = `#react-root > section > div > div > section > div.GHEPc > button.ow3u_ > div`;
const phraseToSearchInResponseUrl = 'include_reel';


const getReelDataFromResponse = async (response) => {
  const pathToLatestReel = 'data.user.reel.latest_reel_media';
  const pathToSeenReel = 'data.user.reel.seen';

  try {
    const responseBody = await response.json();

    return {
      latest: _.get(responseBody, pathToLatestReel),
      seen: _.get(responseBody, pathToSeenReel),
    }
  } catch (e) {
    return null;
  }
};

const getMediaUrl = async (page) => {
  const storyImageSelector = '#react-root > section > div > div > section > div.GHEPc > div > div > div.qbCDp > img';
  const storyVideoSelector = '#react-root > section > div > div > section > div.GHEPc > div > div > div.qbCDp > video';

  try {
    return await page.evaluate((selectors) => {
      let imageElement = document.querySelector(selectors[0]);
      let videoElement = document.querySelector(selectors[1]);

      if (videoElement) {
        return videoElement.children[0].src;
      } else if (imageElement) {
        return imageElement.src;
      }

      return null

    }, [storyImageSelector, storyVideoSelector]);
  } catch (e) {
    return null;
  }
};


const downloadMedia = async (mediaUrl, username, downloadDir) => {
  const today = new Date();
  const saveDirPath = `${downloadDir}/${username}/${today.getFullYear()}${today.getMonth()}${today.getDate()}`;

  fs.access(saveDirPath, fs.constants.F_OK, (err) => {
    err
      ? mkdirp(saveDirPath, (err) => {
        if (err) console.error(err);
        downloadUtils.download(mediaUrl, `${saveDirPath}/${downloadUtils.getFilenameFromUrl(mediaUrl)}`);
      })
      : downloadUtils.download(mediaUrl, `${saveDirPath}/${downloadUtils.getFilenameFromUrl(mediaUrl)}`);
  });
};

const watchReel = async (page, username, config) => {
  console.log(`User page for: '${username}' - found unseen stories`);
  await page.click(storiesButtonSelector);
  await page.waitForSelector(modalSelector);

  while (true) {
    await page.waitFor(1000);

    if (await page.$(modalSelector) == null) {
      break;
    }

    const mediaUrl = await getMediaUrl(page);

    if (mediaUrl != null) {
      try {
        downloadMedia(mediaUrl, username, config.downloadDir);
      } catch (e) {
        console.log(`User page for: '${username}' - Error during media download`);
      }
    } else {
      console.log(`User page for: '${username}' - Could not find media url`);
    }

    await page.click(modalNextButtonSelector);
  }
};

const userPage = async (page, username, config) => {
  const userPageUrl = getUserPageByUsername(username);

  try {
    console.log(`Redirect to: ${userPageUrl}`);
    await page.goto(userPageUrl, {waitUntil: 'domcontentloaded'});
  } catch (e) {
    page.close();
  }

  try {
    const response = await page.waitForResponse(response => response.url().includes(phraseToSearchInResponseUrl) && response.status() === 200);

    const reelData = await getReelDataFromResponse(response);

    if (reelData != null && reelData.latest !== reelData.seen) { // There is unseen media
      await watchReel(page, username, config);
    }

    await page.waitFor(30000);

  } catch (e) {
    console.log(`User page for: '${username}' - Error while processing pages response and reel`);
  }

  page.close();
};

module.exports = (browser, config) => async (user) => {
  const userPageHandler = await browser.newPage();
  await userPage(userPageHandler, user, config);
};
