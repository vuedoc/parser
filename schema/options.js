const { Visibilities, DEFAULT_IGNORED_VISIBILITIES, DEFAULT_ENCODING, VisibilitiesList, FeaturesList } = require('../lib/Enum');

module.exports = {
  type: 'object',
  properties: {
    stringify: {
      type: 'boolean',
      description: 'Set to true to disable parsing of literal values and stringify literal values',
      default: false
    },
    filename: {
      type: 'string',
      description: 'The filename to parse. *Required* unless `filecontent` is passed'
    },
    filecontent: {
      type: 'string',
      description: 'The file content to parse. *Required* unless `filename` is passed'
    },
    encoding: {
      type: 'string',
      description: 'The file encoding',
      default: DEFAULT_ENCODING
    },
    features: {
      type: 'array',
      description: 'The component features to parse and extract',
      items: {
        type: 'string',
        enum: FeaturesList
      },
      default: FeaturesList
    },
    loaders: {
      type: 'array',
      description: 'Use this option to define custom loaders for specific languages'
    },
    defaultMethodVisibility: {
      type: 'string',
      description: 'The default visibility to use for methods',
      enum: VisibilitiesList,
      default: Visibilities.public
    },
    ignoredVisibilities: {
      type: 'array',
      description: 'List of ignored visibilities',
      items: {
        type: 'string',
        enum: DEFAULT_IGNORED_VISIBILITIES
      },
      default: DEFAULT_IGNORED_VISIBILITIES
    }
  }
}
