const zapier = require('zapier-platform-core');

const authentication = require('./authentication');
const newMedia = require('./triggers/new_media');
const createFolder = require('./actions/create_folder');
const { addDefaultHeaders, throwForWistiaError } = require('./api');

module.exports = {
  version: require('../package.json').version,
  platformVersion: zapier.version,
  authentication,
  beforeRequest: [addDefaultHeaders],
  afterResponse: [throwForWistiaError],
  triggers: {
    [newMedia.key]: newMedia,
  },
  creates: {
    [createFolder.key]: createFolder,
  },
  searches: {},
  resources: {},
};
