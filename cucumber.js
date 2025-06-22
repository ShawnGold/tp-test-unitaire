module.exports = {
  default: {
    require: ['features/support/*.js', 'features/step_definitions/*.js'],
    format: [
      'progress-bar',
      '@cucumber/pretty-formatter',
      'json:reports/cucumber_report.json',
      'html:reports/cucumber_report.html'
    ],
    dryRun: false,
    failFast: false,
    paths: ['features/*.feature'],
    requireModule: [],
    strict: true,
    tags: 'not @ignore',
    timeout: 10000,
    worldParameters: {}
  }
};
