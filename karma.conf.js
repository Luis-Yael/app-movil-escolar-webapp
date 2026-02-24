// Karma configuration file created to stabilize test runs (headless Chrome, longer timeouts)
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],

    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },

    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },

    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },

    reporters: ['progress', 'kjhtml'],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,

    // Use a headless launcher with no-sandbox for CI/local stability
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-gpu',
          '--disable-translate',
          '--disable-extensions'
        ]
      }
    },

    // Keep Karma from disconnecting too quickly on slower machines or CI
    browserDisconnectTimeout: 60000,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 60000,
    captureTimeout: 120000,

    singleRun: false,
    restartOnFileChange: true
  });
};
