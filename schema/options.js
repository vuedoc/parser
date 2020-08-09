const { DEFAULT_IGNORED_VISIBILITIES, Features } = require('../lib/Enum');

module.exports = {
  type: 'object',
  properties: {
    filename: {
      type: 'string',
      description: 'The filename to parse. *Required* unless `filecontent` is passed'
    },
    filecontent: {
      type: 'string',
      description: 'The file content to parse. *Required* unless `filename` is passed'
    },
    features: {
      type: 'array',
      description: 'The component features to parse and extract',
      items: {
        type: 'string',
        enum: Features
      },
      default: Features
    },
    loaders: {
      type: 'array',
      description: 'Use this option to define custom loaders for specific languages'
    },
    ignoredVisibilities: {
      type: 'array',
      description: 'List of ignored Visibility',
      items: {
        type: 'string'
      },
      default: DEFAULT_IGNORED_VISIBILITIES
    }
  }
}
