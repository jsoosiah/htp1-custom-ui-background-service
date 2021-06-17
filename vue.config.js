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
        publish: {
          GithubOptions: {
            provider: 'github',
            repo: 'git://github.com/jsoosiah/htp1-custom-ui-background-service.git',
            owner: 'jsoosiah',
          },
        },
      },
    },
  },
};
