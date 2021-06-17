module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      builderOptions: {
        appId: 'com.jsoosiah.htp1CustomUiBackgroundService',
        linux: {
          category: 'Utility',
        },
        mac: {},
        win: {
          target: [
            {
              target: 'nsis',
              arch: ['x64'],
            },
          ],
        },
        nsis: {},
        publish: {
          provider: 'github',
          repo: 'htp1-custom-ui-background-service',
          owner: 'jsoosiah',
        },
      },
    },
  },
};
