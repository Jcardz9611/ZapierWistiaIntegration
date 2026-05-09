const sample = require('../samples/media');
const { wistiaRequest } = require('../api');

const mapMedia = (media) => ({
  id: media.hashed_id || String(media.id),
  numeric_id: media.id,
  name: media.name,
  description: media.description || null,
  hashed_id: media.hashed_id,
  type: media.type,
  status: media.status,
  archived: media.archived,
  progress: media.progress,
  created: media.created,
  updated: media.updated,
  duration: media.duration,
  thumbnail_url: media.thumbnail ? media.thumbnail.url : null,
});

const perform = async (z, bundle) => {
  const params = {
    sort_by: 'created',
    sort_direction: 0,
    per_page: bundle.meta.isLoadingSample ? 3 : 25,
  };

  if (bundle.inputData.folder_hashed_id) {
    params.folder_id = bundle.inputData.folder_hashed_id;
  }

  if (bundle.inputData.media_type) {
    params.type = bundle.inputData.media_type;
  }

  const medias = await wistiaRequest(z, bundle, {
    method: 'GET',
    path: '/medias',
    params,
  });

  return medias.map(mapMedia);
};

module.exports = {
  key: 'new_media',
  noun: 'Media',
  display: {
    label: 'New Media',
    description: 'Triggers when new media is available in Wistia.',
  },
  operation: {
    inputFields: [
      {
        key: 'folder_hashed_id',
        label: 'Folder Hashed ID',
        type: 'string',
        required: false,
        helpText:
          'Optional. Limit results to media from one folder. Wistia renamed projects to folders in the modern API, so this filters by folder hashed ID.',
      },
      {
        key: 'media_type',
        label: 'Media Type',
        type: 'string',
        required: false,
        choices: {
          Video: 'Video',
          Audio: 'Audio',
          Image: 'Image',
          PdfDocument: 'PDF Document',
          MicrosoftOfficeDocument: 'Microsoft Office Document',
          Swf: 'SWF',
          UnknownType: 'Unknown Type',
        },
      },
    ],
    perform,
    sample,
    outputFields: [
      { key: 'id', label: 'Zapier ID' },
      { key: 'numeric_id', label: 'Numeric ID', type: 'integer' },
      { key: 'name', label: 'Name' },
      { key: 'description', label: 'Description' },
      { key: 'hashed_id', label: 'Hashed ID' },
      { key: 'type', label: 'Type' },
      { key: 'status', label: 'Status' },
      { key: 'archived', label: 'Archived', type: 'boolean' },
      { key: 'progress', label: 'Progress', type: 'number' },
      { key: 'created', label: 'Created At' },
      { key: 'updated', label: 'Updated At' },
      { key: 'duration', label: 'Duration', type: 'number' },
      { key: 'thumbnail_url', label: 'Thumbnail URL' },
    ],
  },
};
