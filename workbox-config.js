module.exports = {
  globDirectory: 'public/',
  globPatterns: [
    '**/*.{html,css,js,png,jpg,jpeg,gif,svg,json,ico}'
  ],
  swDest: 'public/service-worker.js',
  ignoreURLParametersMatching: [
    /^utm_/,
    /^fbclid$/
  ]
};