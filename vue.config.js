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
          icon: 'icon.png',
        },
        win: {
          icon: 'icon.ico',
          target: {
            target: 'nsis',
            arch: ['x64', 'ia32'],
          },
        },
        nsis: {
          installerIcon: 'installerIcon.ico',
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
