const browserify = require('@cypress/browserify-preprocessor');
const cucumber = require('cypress-cucumber-preprocessor').default;
const path = require('path');
const axios = require('axios');
const default_config = require('../../cypress-bdd.json') // yup, relative local modules



module.exports = (on, config) => {

  const options = {
    ...browserify.defaultOptions,
    typescript: path.join(path.resolve('..'), 'kiali-ui/node_modules/typescript'),
  };

  on('file:preprocessor', cucumber(options));

  async function exportConfig() {
    const getAuthStrategy = async () => {
      try {
        const resp = await axios.get(config.env.base_URL)
        return JSON.stringify(resp.data)
      } catch (err) {
        console.error(err);
        throw new Error(`Kiali API is not reachable at ${JSON.stringify(err.config.url)}`)
      }
    }

    config.env.cypress_config = default_config
    config.env.base_URL = `${default_config.baseUrl}/api/auth/info`
    config.env.auth_strategy = await getAuthStrategy()

    return await config
  }

  return exportConfig()
};


