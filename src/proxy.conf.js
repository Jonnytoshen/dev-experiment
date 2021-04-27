module.exports = [
  {
    context: ['/geoserver'],
    target: 'http://39.98.140.254:8080',
    secure: false,
    pathRewrite: {},
    changeOrigin: true,
    logLevel: "debug",
  }
];
