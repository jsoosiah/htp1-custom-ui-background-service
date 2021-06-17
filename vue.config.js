module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      builderOptions: {
        appId: 'com.jsoosiah.htp1CustomUiBackgroundService',
        linux: {
          category: 'Utility',
          icon: 'icon.png',
        },
        mac: {
          icon: 'build/icon.png',
        },
        win: {
          icon: 'build/icon.ico',
        },
        publish: {
          provider: 'github',
          repo: 'htp1-custom-ui-background-service',
          owner: 'jsoosiah',
        },
      },
    },
  },
};
