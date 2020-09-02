export default {
  mode: 'doc',
  title: 'iuc',
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'iuc',
        // camel2DashComponentName: false,
        customStyleName: name => {
          return `./style/index.less`; // 注意：这里 ./ 不可省略
        },
      }
    ],
  ],
}