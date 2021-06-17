module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      builderOptions: {
        appId: 'com.jsoosiah.htp1CustomUiBackgroundService',
        electronDownload: {
          cache: './.electron-cache',
        },
      },
    },
  },
};
