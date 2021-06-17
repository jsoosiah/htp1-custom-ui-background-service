module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      builderOptions: {
        appId: 'com.jsoosiah.htp1CustomUiBackgroundService',
        linux: {
          icon: 'icon.png',
          category: 'Utility',
        },
        mac: { icon: 'icon.png' },
        win: {
          icon: 'icon.ico',
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
