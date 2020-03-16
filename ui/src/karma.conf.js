// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html


module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      // require('karma-chrome-launcher'),  /*comment out this line to disable the karma-chrome-launcher*/
      require('karma-phantomjs-launcher'),  /* add this line to disable the karma-phantomjs-launcher*/
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/jenkins'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    reporters: config.angularCli && config.angularCli.codeCoverage
    ? ['progress', 'coverage-istanbul']
    : ['progress', 'kjhtml'],
    files: [
      { pattern: './src/test.ts', watched: false }
    ],
    preprocessors: {
    },
    mime: {
      'text/x-typescript': ['ts', 'tsx']
    },
    angularCli: {
      environment: 'dev'
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'], /*remove chrome and replace it with PhantomJS */
    singleRun: true  /*make it true to run test suits only one time*/
  });
};
