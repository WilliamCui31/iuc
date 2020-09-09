export default {
  mode: 'doc',
  title: 'iuc',
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'iuc',
        libraryDirectory: "lib",
        customStyleName: name => {
          return `./style`; // 注意：这里 ./ 不可省略
        },
      },
    ],
  ],
  base: '/iuc',
  publicPath: '/iuc/'
}