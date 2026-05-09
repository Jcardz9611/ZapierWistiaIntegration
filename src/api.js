const BASE_URL = 'https://api.wistia.com/modern';
const API_VERSION = '2026-03';

const addDefaultHeaders = (request, z, bundle) => {
  const apiToken =
    (bundle.authData && bundle.authData.api_token) ||
    (bundle.inputData && bundle.inputData.api_token);

  request.headers = request.headers || {};

  if (!request.headers.Authorization && apiToken) {
    request.headers.Authorization = `Bearer ${apiToken}`;
  }

  if (!request.headers['X-Wistia-API-Version']) {
    request.headers['X-Wistia-API-Version'] = API_VERSION;
  }

  if (!request.headers.Accept) {
    request.headers.Accept = 'application/json';
  }

  if (request.body && !request.headers['Content-Type']) {
    request.headers['Content-Type'] = 'application/json';
  }

  return request;
};

const throwForWistiaError = (response, z) => {
  if (response.status === 401) {
    throw new z.errors.Error(
      'Authentication failed. Check that your Wistia API token is valid.',
      'AuthenticationError',
      response.status,
    );
  }

  if (response.status >= 400) {
    const message =
      (response.data && (response.data.error || response.data.message)) ||
      `Wistia API returned status ${response.status}.`;

    throw new z.errors.Error(message, 'WistiaApiError', response.status);
  }

  return response;
};

const wistiaRequest = async (z, bundle, options) => {
  const response = await z.request({
    ...options,
    url: `${BASE_URL}${options.path}`,
  });

  response.throwForStatus();
  return response.data;
};

const normalizeBooleanInput = (value) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }

  return false;
};

module.exports = {
  API_VERSION,
  addDefaultHeaders,
  throwForWistiaError,
  wistiaRequest,
  normalizeBooleanInput,
};
