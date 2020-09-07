export default {
  mode: 'doc',
  title: 'iuc',
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'iuc',
        // camel2DashComponentName: false,
        // camel2UnderlineComponentName: false,
        libraryDirectory: "lib",
        customStyleName: name => {
          return `./style/index.less`; // 注意：这里 ./ 不可省略
        },
      }
    ],
  ],
  base: '/iuc',
  publicPath: '/iuc/'
}