var path = require('path')
var WebpackNotifierPlugin = require('webpack-notifier')

var publicAssets = 'public/assets'
var sourceFiles = 'gulp/assets'
var env = process.env.ENV || 'development'

module.exports = {
  // Global environment. Tasks watch for changes in development only
  env: env,

  // The public assets folder
  publicAssets: publicAssets,

  // node-sass / libsass configuration
  sass: {
    src: [
      sourceFiles + '/stylesheets/application.sass'
    ],
    allSrc: [
      sourceFiles + '/**/*.sass'
    ],
    dest: publicAssets + '/stylesheets',
    settings: {
      indentedSyntax: true,
      imagePath: '/assets/images',
      sourceComments: true,
      includePaths: [
        'node_modules/compass-mixins/lib'
      ]
    }
  },

  // Source and destination paths for images
  images: {
    src: sourceFiles + '/images/**',
    dest: publicAssets + '/images'
  },

  // Source and destination paths for javascripts
  js: {
    src: sourceFiles + '/javascripts/*.js',
    dest: publicAssets + '/javascripts/'
  },

  // Webpack configuration
  webpack: {
    watch: true,
    devtool: '#inline-source-map',
    context: path.resolve(sourceFiles + '/javascripts'),
    output: {
      filename: '[name].js',
      path: path.resolve(publicAssets + '/javascripts')
    },
    resolve: {
      extensions: ['', '.js', '.jsx'],
      root: path.resolve(sourceFiles + '/javascripts'),
      modulesDirectories: ['node_modules'],
      // alias: {
      //   'jquery': path.resolve(sourceFiles + '/javascripts/vendor/jquery-1.11.3-min.js')
      // }
    },
    node: {
      fs: 'empty'
    },
    entry: {
      application: './application',
      vendor: './vendor'
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|vendor\/)/,
          loader: 'babel-loader?loose=all'
        }, {
          test: /\.json$/,
          loader: 'json'
        }
      ]
    },
    plugins: [
      new WebpackNotifierPlugin()
    ]
  },

  browserSync: {
    port: 8080
  },

  haml: {
    src: sourceFiles + '/haml/*.haml',
    dest: 'public',
    settings: {}
  }
}
