const sample = require('../samples/folder');
const { normalizeBooleanInput, wistiaRequest } = require('../api');

const mapFolder = (folder) => ({
  id: folder.id,
  name: folder.name,
  description: folder.description || null,
  hashed_id: folder.hashed_id,
  public: folder.public,
  public_id: folder.public_id,
  media_count: folder.media_count,
  created: folder.created,
  updated: folder.updated,
});

const perform = async (z, bundle) => {
  const body = {
    name: bundle.inputData.name,
  };

  if (bundle.inputData.admin_email) {
    body.adminEmail = bundle.inputData.admin_email;
  }

  if (bundle.inputData.public !== undefined) {
    body.public = normalizeBooleanInput(bundle.inputData.public);
  }

  const folder = await wistiaRequest(z, bundle, {
    method: 'POST',
    path: '/folders',
    body,
  });

  return mapFolder(folder);
};

module.exports = {
  key: 'create_folder',
  noun: 'Folder',
  display: {
    label: 'Create Folder',
    description:
      'Creates a new Wistia folder. In the modern Wistia API this replaces the older "project" concept.',
  },
  operation: {
    inputFields: [
      {
        key: 'name',
        label: 'Folder Name',
        type: 'string',
        required: true,
      },
      {
        key: 'admin_email',
        label: 'Owner Email',
        type: 'string',
        required: false,
        helpText:
          'Optional. Set a specific owner for the new folder. If omitted, Wistia uses the account owner.',
      },
      {
        key: 'public',
        label: 'Public Folder',
        type: 'boolean',
        required: false,
        helpText:
          'Optional. Set to true to make the folder publicly accessible in Wistia.',
      },
    ],
    perform,
    sample,
    outputFields: [
      { key: 'id', label: 'Numeric ID', type: 'integer' },
      { key: 'name', label: 'Name' },
      { key: 'description', label: 'Description' },
      { key: 'hashed_id', label: 'Hashed ID' },
      { key: 'public', label: 'Public', type: 'boolean' },
      { key: 'public_id', label: 'Public ID' },
      { key: 'media_count', label: 'Media Count', type: 'integer' },
      { key: 'created', label: 'Created At' },
      { key: 'updated', label: 'Updated At' },
    ],
  },
};
