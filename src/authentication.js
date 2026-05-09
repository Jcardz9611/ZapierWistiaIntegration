const { API_VERSION, wistiaRequest } = require('./api');

const testAuth = async (z, bundle) => {
  const apiToken =
    (bundle.authData && bundle.authData.api_token) ||
    (bundle.inputData && bundle.inputData.api_token);

  if (!apiToken) {
    throw new z.errors.Error(
      'Missing Wistia API token.',
      'AuthenticationError',
      401,
    );
  }

  return wistiaRequest(z, bundle, {
    method: 'GET',
    path: '/account',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'X-Wistia-API-Version': API_VERSION,
      Accept: 'application/json',
    },
  });
};

module.exports = {
  type: 'custom',
  test: testAuth,
  connectionLabel: 'Wistia account',
  fields: [
    {
      key: 'api_token',
      label: 'Wistia API Token',
      type: 'password',
      required: true,
      helpText:
        'Create an API token in Wistia and grant it the scopes needed by your Zap. Docs: https://docs.wistia.com/docs/making-api-requests. The trigger works with read scopes; the create action requires a token that can create folders.',
    },
  ],
};
