# 组件库开发环境搭建

- [概览](#%E6%A6%82%E8%A7%88)
- [准备工作](#%E5%87%86%E5%A4%87%E5%B7%A5%E4%BD%9C)
  - [初始化项目](#%E5%88%9D%E5%A7%8B%E5%8C%96%E9%A1%B9%E7%9B%AE)
  - [代码规范](#%E4%BB%A3%E7%A0%81%E8%A7%84%E8%8C%83)
  - [Commit Lint](#commit-lint)
  - [TypeScript](#typescript)
  - [测试](#%E6%B5%8B%E8%AF%95)
- [开发与调试](#%E5%BC%80%E5%8F%91%E4%B8%8E%E8%B0%83%E8%AF%95)
  - [安装dumi以及自定义配置](#安装dumi以及自定义配置)
  - [编写文档](#%E7%BC%96%E5%86%99%E6%96%87%E6%A1%A3)
- [组件库打包](#%E7%BB%84%E4%BB%B6%E5%BA%93%E6%89%93%E5%8C%85)
  - [导出类型声明文件](#%E5%AF%BC%E5%87%BA%E7%B1%BB%E5%9E%8B%E5%A3%B0%E6%98%8E%E6%96%87%E4%BB%B6)
  - [导出 Commonjs 模块](#%E5%AF%BC%E5%87%BA-commonjs-%E6%A8%A1%E5%9D%97)
    - [babel 配置](#babel-%E9%85%8D%E7%BD%AE)
    - [gulp 配置](#gulp-%E9%85%8D%E7%BD%AE)
  - [导出 ES module](#%E5%AF%BC%E5%87%BA-es-module)
  - [处理样式文件](#%E5%A4%84%E7%90%86%E6%A0%B7%E5%BC%8F%E6%96%87%E4%BB%B6)
    - [拷贝 less 文件](#%E6%8B%B7%E8%B4%9D-less-%E6%96%87%E4%BB%B6)
    - [生成 css 文件](#%E7%94%9F%E6%88%90-css-%E6%96%87%E4%BB%B6)
    - [生成 css.js](#%E7%94%9F%E6%88%90-cssjs)
  - [按需加载](#%E6%8C%89%E9%9C%80%E5%8A%A0%E8%BD%BD)
- [标准化发布流程](#%E6%A0%87%E5%87%86%E5%8C%96%E5%8F%91%E5%B8%83%E6%B5%81%E7%A8%8B)
- [初始化组件](#%E5%88%9D%E5%A7%8B%E5%8C%96%E7%BB%84%E4%BB%B6)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 概览

本文包含以下内容：

- prepare: 组件库前期开发准备工作。`eslint`/`commit lint`/`typescript`等等；
- dev: 使用[dumi](https://d.umijs.org/)进行开发调试以及文档编写；
- build: `cjs`/`esm`、types、polyfill 以及按需加载；
- release: 组件库发布流程；
- other: 使用[plop.js](https://plopjs.com/)快速创建组件模板。

## 准备工作

### 初始化项目

新建一个`iuc`文件夹，并初始化。

```bash
mkdir iuc

cd iuc

npm init

mkdir src && cd src && touch index.ts # 新建源码文件夹以及入口文件

```

### 代码规范

此处直接使用[@umijs/fabric](https://github.com/umijs/fabric)的配置。

```bash
yarn add @umijs/fabric --dev

yarn add prettier --dev # 因为@umijs/fabric没有将prettier作为依赖 所以我们需要手动安装
```

**.eslintrc.js**

```js
module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
};
```

**.prettierrc.js**

```js
const fabric = require('@umijs/fabric');

module.exports = {
  ...fabric.prettier,
};
```

**.stylelintrc.js**

```js
module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/stylelint')],
};
```

想自行配置的同学可以参考以下文章：

- [Linting Your React+Typescript Project with ESLint and Prettier!](https://medium.com/@dors718/linting-your-react-typescript-project-with-eslint-and-prettier-2423170c3d42)
- [使用 ESLint+Prettier 规范 React+Typescript 项目 ](https://zhuanlan.zhihu.com/p/62401626)

### Commit Lint

进行`pre-commit`代码规范检测。

```bash
yarn add husky lint-staged --dev
```

**package.json**

```json
"lint-staged": {
  "src/**/*.ts?(x)": [
    "prettier --write",
    "eslint --fix",
    "git add"
  ],
  "src/**/*.less": [
    "stylelint --syntax less --fix",
    "git add"
  ]
},
"husky": {
  "hooks": {
    "pre-commit": "lint-staged"
  }
}
```

进行 Commit Message 检测。

```bash
yarn add @commitlint/cli @commitlint/config-conventional commitizen cz-conventional-changelog --dev
```

新增`.commitlintrc.js`写入以下内容

```js
module.exports = { extends: ['@commitlint/config-conventional'] };
```

package.json 写入以下内容：

```json
// ...
"scripts": {
  "commit": "git-cz",
}
// ...
"husky": {
  "hooks": {
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
    "pre-commit": "lint-staged"
  }
},
"config": {
  "commitizen": {
    "path": "cz-conventional-changelog"
  }
}
```

后续使用 `yarn commit` 替代 `git commit`生成规范的 Commit Message，当然为了效率你可以选择手写，但是要符合规范。

### TypeScript

```bash
yarn add typescript --dev
```

新建`tsconfig.json`并写入以下内容

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "target": "esnext",
    "module": "commonjs",
    "jsx": "react",
    "declaration": true,
    "declarationDir": "lib",
    "strict": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "resolveJsonModule": true
  },
  "include": ["components", "global.d.ts"],
  "exclude": ["node_modules"]
}
```

### 测试

在`src`文件夹下新建`button`文件夹，目录结构如下：

```
button
    ├── button.tsx           # 源文件
    ├── index.ts            # 入口文件
    ├── types.ts        # 类型声明文件
    └── style
        ├── index.less      # 样式文件
        └── index.ts        # 样式文件里为什么存在一个index.ts - 按需加载样式 管理样式依赖 后面章节会提到
```

安装`React`相关依赖：

```bash
yarn add react react-dom @types/react @types/react-dom --dev # 开发时依赖，宿主环境一定存在
```

**src/button/types.ts**

```js
import { ReactNode } from 'react';

export type ButtonType = 'default' | 'primary' | 'ghost' | 'dashed' | 'link' | 'text';
export type ButtonSize = 'default' | 'large' | 'small';

export types ButtonProps {
  children: ReactNode
  type?: ButtonType,
  size?: ButtonSize,
  className?: string
}
```

**sc/button/button.tsx**

```jsx
import React, { FC } from 'react';
import classnames from 'classnames';
import { ButtonProps } from './types';

const prefixCls = 'iuc-btn';

/**
 *
 * @param ButtonProps
 * @returns ReactNode
 */
const Button: FC<ButtonProps> = ({ type, size, children, className, ...rest }) => {
  const classes = classnames(prefixCls, className, {
    [`${prefixCls}-${type}`]: type,
    [`${prefixCls}-${size}`]: size,
  });
  return (
    <button className={classes} type="button" {...rest}>
      {children}
    </button>
  );
};

export default Button;
```

**src/button/index.ts**

```js
import Button from './button';

export default Button;

export * from './types';
```

**src/button/style/index.less**

```less
@btn-prefix-cls: iuc-btn;

.@{btn-prefix-cls} {
  height: 32px;
  margin: 10px;
  padding: 4px 15px;
  line-height: 1.5715;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  border: 1px solid #d9d9d9;
  background-color: #fff;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  user-select: none;
  touch-action: manipulation;
  &:hover {
    color: #40a9ff;
    background: #fff;
    border-color: #40a9ff;
  }
  &-primary {
    color: #fff;
    border-color: #1890ff;
    background-color: #1890ff;
    &:hover {
      color: #fff;
      background: #40a9ff;
      border-color: #40a9ff;
    }
  }
  &-dashed {
    border-style: dashed;
    &:hover {
      color: #40a9ff;
      background: #fff;
      border-color: #40a9ff;
    }
  }
  &-text {
    border-color: transparent;
    &:hover {
      color: rgba(0, 0, 0, 0.85);
      background: rgba(0, 0, 0, 0.018);
      border-color: transparent;
    }
  }
  &-link {
    color: #1890ff;
    border-color: transparent;
    &:hover {
      color: #40a9ff;
      border-color: transparent;
    }
  }
  &-large {
    height: 40px;
    padding: 6.4px 15px;
    font-size: 16px;
  }
  &-small {
    height: 24px;
    padding: 0 7px;
    font-size: 14px;
  }
}
```

**src/button/style/index.ts**

```js
import '../../style/index.less';
import './index.less';
```

**src/index.ts**

```js
export { default as Button } from './button';
```

准备工作完成。

## 开发与调试

本节解决开发组件时的预览以及调试问题，顺路解决文档编写。

此处选择[dumi](https://d.umijs.org/)来辅助预览调试。

### 安装dumi以及自定义配置

```bash
yarn add dumi --dev
```

增加 `npm scripts` 至 `package.json`。

```json
"scripts": {
  "doc:dev": "npx dumi dev"
},
```

> 注意：本节所有操作都是针对站点应用。`打包`指代文档站点打包，而非组件库。

新建`.umirc.ts`配置文件，并写入以下内容：

**.umirc.js**

```js
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
          return `./style/index.less`; // 注意：这里 ./ 不可省略
        },
      }
    ],
  ],
}
```

### 编写文档

新建`src/button/index.md`，并写入以下内容：

```md
---
title: Button
---

# Button 按钮

按钮用于开始一个即时操作。

## 代码演示

/```tsx
import React, { FC } from 'react';
import { Button } from 'iuc';

const App: FC = () => {
  return <>
    <Button type="primary">Primary Button</Button>
    <Button>Default Button</Button>
    <Button type="dashed">Dashed Button</Button>
    <br />
    <Button type="text">Text Button</Button>
    <Button type="link">Link Button</Button>
    <br />
    <Button type="primary" size="large">Large</Button>
    <Button type="primary">Default</Button>
    <Button type="primary" size="small">Small</Button>
  </>
};

export default App;
/```

## API
| 属性  | 说明       | 类型                                                               | 默认值     |
| ---- | ----       | ---                                                               | --------- |
| type | 设置按钮类型 | `primary` \| `ghost` \| `dashed` \| `link` \| `text` \| `default` | `default` |
| size | 设置按钮大小 | `large` \| `middle` \| `small `                                   | `default` |
```

执行脚本命令：

```bash
yarn doc:dev
```

现在可以在`index.md`中愉快地进行文档编写和调试了！

## 组件库打包

**宿主环境各不相同，需要将源码进行相关处理后发布至 npm。**

明确以下目标：

1. 导出类型声明文件；
2. 导出 `umd`/`Commonjs module`/`ES module` 等 3 种形式供使用者引入；
3. 支持样式文件 `css` 引入，而非只有`less`，减少业务方接入成本；
4. 支持按需加载。

### 导出类型声明文件

既然是使用`typescript`编写的组件库，那么使用者应当享受到类型系统的好处。

我们可以生成类型声明文件，并在`package.json`中定义入口，如下：

**package.json**

```json
{
  "typings": "lib/index.d.ts", // 定义类型入口文件
  "scripts": {
    "build:types": "tsc -p tsconfig.build.json && cpr lib esm" // 执行tsc命令生成类型声明文件
  }
}
```

> 值得注意的是：此处使用`cpr`(需要手动安装)将`lib`的声明文件拷贝了一份，并将文件夹重命名为`esm`，用于后面存放 ES module 形式的组件。这样做的原因是保证用户手动按需引入组件时依旧可以获取自动提示。

**tsconfig.build.json**

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": { "emitDeclarationOnly": true }, // 只生成声明文件
  "exclude": ["**/__tests__/**", "**/demo/**", "node_modules", "lib", "esm"] // 排除示例、测试以及打包好的文件夹
}
```

执行`yarn build:types`，可以发现根目录下已经生成了`lib`文件夹（`tsconfig.json`中定义的`declarationDir`字段）以及`esm`文件夹（拷贝而来），目录结构与`src`文件夹保持一致，如下：

**lib**

```
├── button
│   ├── button.d.ts
│   ├── index.d.ts
│   ├── types.d.ts
│   └── style
│       └── index.d.ts
└── index.d.ts
```

这样使用者引入`npm` 包时，便能得到自动提示，也能够复用相关组件的类型定义。

接下来将`ts(x)`等文件处理成`js`文件。

> 需要注意的是，我们需要输出`Commonjs module`以及`ES module`两种模块类型的文件（暂不考虑`umd`），以下使用`cjs`指代`Commonjs module`，`esm`指代`ES module`。<br/> 对此有疑问的同学推荐阅读：[import、require、export、module.exports 混合详解](https://github.com/ShowJoy-com/showjoy-blog/issues/39)

### 导出 Commonjs 模块

其实完全可以使用`babel`或`tsc`命令行工具进行代码编译处理（实际上很多工具库就是这样做的），但考虑到还要**样式处理及其按需加载**，我们借助 `gulp` 来串起这个流程。

#### babel 配置

首先安装`babel`及其相关依赖

```bash
yarn add @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript @babel/plugin-proposal-class-properties  @babel/plugin-transform-runtime --dev
```

```bash
yarn add @babel/runtime-corejs3
```

新建`.babelrc.js`文件，写入以下内容：

**.babelrc.js**

```js
module.exports = {
  presets: ['@babel/env', '@babel/typescript', '@babel/react'],
  plugins: [
    '@babel/proposal-class-properties',
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 3,
        helpers: true,
      },
    ],
  ],
};
```

关于`@babel/plugin-transform-runtime`与`@babel/runtime-corejs3`：

- 若`helpers`选项设置为`true`，可抽离代码编译过程重复生成的 `helper` 函数（`classCallCheck`,`extends`等），减小生成的代码体积；
- 若`corejs`设置为`3`，可引入不污染全局的按需`polyfill`，常用于类库编写（我更推荐：不引入`polyfill`，转而告知使用者需要引入何种`polyfill`，避免重复引入或产生冲突，后面会详细提到）。

更多参见[官方文档-@babel/plugin-transform-runtime ](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime)

**配置目标环境**

为了避免转译浏览器原生支持的语法，新建`.browserslistrc`文件，根据适配需求，写入支持浏览器范围，作用于`@babel/preset-env`。

**.browserslistrc**

```
>0.2%
not dead
not op_mini all
```

很遗憾的是，`@babel/runtime-corejs3`无法在按需引入的基础上根据目标浏览器支持程度再次减少`polyfill`的引入，参见[@babel/runtime for target environment ](https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#babelruntime-for-target-environment)。

这意味着`@babel/runtime-corejs3` 甚至会在针对现代引擎的情况下注入所有可能的 `polyfill`：不必要地增加了最终捆绑包的大小。

对于组件库（代码量可能很大），个人建议将`polyfill`的选择权交还给使用者，在宿主环境进行`polyfill`。若使用者具有兼容性要求，自然会使用`@babel/preset-env + core-js + .browserslistrc`进行全局`polyfill`，这套组合拳引入了最低目标浏览器不支持`API`的全部 `polyfill`。

> 顺带一提，业务开发中，若将`@babel/preset-env`的`useBuiltIns`选项值设置为 `usage`，同时把`node_modules`从`babel-loader`中`exclude`，会导致`babel` 无法检测到`nodes_modules`中所需要的`polyfill`。["useBuiltIns: usage" for node_modules without transpiling #9419](https://github.com/babel/babel/issues/9419)，在未支持该`issue`提到的内容之前，请将`useBuiltIns`设置为`entry`，或者不要把`node_modules`从`babel-loader`中`exclude`。

所以组件库不用画蛇添足，引入多余的`polyfill`，写好文档说明，比什么都重要（就像[zent](https://github.com/youzan/zent#required-polyfills)和[antd](https://ant.design/docs/react/getting-started-cn#%E5%85%BC%E5%AE%B9%E6%80%A7)这样）。

现在`@babel/runtime-corejs3`更换为`@babel/runtime`，只进行`helper`函数抽离。

```bash
yarn remove @babel/runtime-corejs3

yarn add @babel/runtime
```

**.babelrc.js**

```js
module.exports = {
  presets: ['@babel/env', '@babel/typescript', '@babel/react'],
  plugins: ['@babel/plugin-transform-runtime', '@babel/proposal-class-properties'],
};
```

> `@babel/transform-runtime`的`helper`选项默认为`true`。

#### gulp 配置

再来安装`gulp`相关依赖

```bash
yarn add gulp gulp-babel --dev
```

新建`gulpfile.js`，写入以下内容：

**gulpfile.js**

```js
const gulp = require('gulp');
const babel = require('gulp-babel');

const paths = {
  dest: {
    lib: 'lib', // commonjs 文件存放的目录名 - 本块关注
    esm: 'esm', // ES module 文件存放的目录名 - 暂时不关心
    dist: 'dist', // umd文件存放的目录名 - 暂时不关心
  },
  styles: 'src/**/*.less', // 样式文件路径 - 暂时不关心
  scripts: ['src/**/*.{ts,tsx}', '!src/**/demo/*.{ts,tsx}', '!src/.umi/**/*.{ts,tsx}'], // 脚本文件路径
};

function compileCJS() {
  const { dest, scripts } = paths;
  return gulp
    .src(scripts)
    .pipe(babel()) // 使用gulp-babel处理
    .pipe(gulp.dest(dest.lib));
}

// 并行任务 后续加入样式处理 可以并行处理
const build = gulp.parallel(compileCJS);

exports.build = build;

exports.default = build;
```

修改`package.json`

**package.json**

```diff
{
- "main": "index.js",
+ "main": "lib/index.js",
  "scripts": {
    ...
+   "clean": "rimraf lib esm dist",
+   "build": "npm run clean && npm run build:types && gulp",
    ...
  },
}
```

执行`yarn build`，得到如下内容：

**lib**

```
├── button
│   ├── button.js
│   ├── index.js
│   ├── types.js
│   └── style
│       └── index.js
└── index.js
```

观察编译后的源码，可以发现：诸多`helper`方法已被抽离至`@babel/runtime`中，模块导入导出形式也是`commonjs`规范。

### 导出 ES module

生成`ES module`可以更好地进行[tree shaking](https://webpack.docschina.org/guides/tree-shaking/)，基于上一步的`babel`配置，更新以下内容：

1. 配置`@babel/preset-env`的`modules`选项为`false`，关闭模块转换；
2. 配置`@babel/plugin-transform-runtime`的`useESModules`选项为`true`，使用`ES module`形式引入`helper`函数。

**.babelrc.js**

```js
module.exports = {
  presets: [
    [
      '@babel/env',
      {
        modules: false, // 关闭模块转换
      },
    ],
    '@babel/typescript',
    '@babel/react',
  ],
  plugins: [
    '@babel/proposal-class-properties',
    [
      '@babel/plugin-transform-runtime',
      {
        useESModules: true, // 使用esm形式的helper
      },
    ],
  ],
};
```

目标达成，我们再使用环境变量区分`esm`和`cjs`（执行任务时设置对应的环境变量即可），最终`babel`配置如下：

**.babelrc.js**

```js
module.exports = {
  presets: ['@babel/env', '@babel/typescript', '@babel/react'],
  plugins: ['@babel/plugin-transform-runtime', '@babel/proposal-class-properties'],
  env: {
    esm: {
      presets: [
        [
          '@babel/env',
          {
            modules: false,
          },
        ],
      ],
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            useESModules: true,
          },
        ],
      ],
    },
  },
};
```

接下来修改`gulp`相关配置，抽离`compileScripts`任务，增加`compileESM`任务。

**gulpfile.js**

```js
// ...

/**
 * 编译脚本文件
 * @param {string} babelEnv babel环境变量
 * @param {string} destDir 目标目录
 */
function compileScripts(babelEnv, destDir) {
  const { scripts } = paths;
  // 设置环境变量
  process.env.BABEL_ENV = babelEnv;
  return gulp
    .src(scripts)
    .pipe(babel()) // 使用gulp-babel处理
    .pipe(gulp.dest(destDir));
}

/**
 * 编译cjs
 */
function compileCJS() {
  const { dest } = paths;
  return compileScripts('cjs', dest.lib);
}

/**
 * 编译esm
 */
function compileESM() {
  const { dest } = paths;
  return compileScripts('esm', dest.esm);
}

// 串行执行编译脚本任务（cjs,esm） 避免环境变量影响
const buildScripts = gulp.series(compileCJS, compileESM);

// 整体并行执行任务
const build = gulp.parallel(buildScripts);

// ...
```

执行`yarn build`，可以发现生成了`lib`/`esm`两个文件夹，观察`esm`目录，结构同`lib`一致，js 文件都是以`ES module`模块形式导入导出。


别忘了给`package.json`增加相关入口。

**package.json**

```diff
{
+ "module": "esm/index.js"
}
```

### 处理样式文件

#### 拷贝 less 文件

我们会将`less`文件包含在`npm`包中，用户可以通过`iuc/lib/button/style/index.js`的形式按需引入`less`文件，此处可以直接将 less 文件拷贝至目标文件夹。

在`gulpfile.js`中新建`copyLess`任务。

**gulpfile.js**

```js
// ...

/**
 * 拷贝less文件
 */
function copyLess() {
  return gulp.src(paths.styles).pipe(gulp.dest(paths.dest.lib)).pipe(gulp.dest(paths.dest.esm));
}

const build = gulp.parallel(buildScripts, copyLess);

// ...
```

观察`lib`目录，可以发现 `less` 文件已被拷贝至`button/style`目录下。

**lib**

```
├── button
│   ├── button.js
│   ├── index.js
│   ├── types.js
│   └── style
│       ├── index.js
│       └── index.less # less文件
└── index.js
```

可能有些同学已经发现问题：若使用者没有使用`less`预处理器，使用的是`sass`方案甚至原生`css`方案，那现有方案就搞不定了。经分析，有以下 4 种预选方案：

1. 告知业务方增加`less-loader`。会导致业务方使用成本增加；
2. 打包出一份完整的 `css` 文件，进行**全量**引入。无法进行按需引入；
3. `css in js`方案；
4. 提供一份`style/css.js`文件，引入组件 `css`样式依赖，而非 `less` 依赖，组件库底层抹平差异。

重点看一看方案 3 以及方案 4。

`css in js`除了赋予样式编写更多的可能性之外，在编写第三方组件库时更是利器。

如果我们写一个`react-use`这种`hooks`工具库，不涉及到样式，只需要在`package.json`中设置`sideEffects`为`false`，业务方使用 webpack 进行打包时，只会打包被使用到的 hooks（优先使用 ES module）。

入口文件`index.js`中导出的但未被使用的其他 hooks 会被`tree shaking`，第一次使用这个库的时候我很好奇，为什么没有按需引入的使用方式，结果打包分析时我傻了，原来人家天生支持按需引入。

可能常用的`antd`以及`lodash`都要配一配，导致产生了惯性思维。

回到正题。如果将样式使用`javascript`来编写，在某种维度上讲，组件库和工具库一致了，配好`sideEffects`，就可以自动按需引入。

而且每个组件都与自己的样式绑定，不需要业务方或组件开发者去**维护样式依赖**，什么是样式依赖，后面会讲到。

缺点：

1. 样式无法单独缓存；
2. styled-components 自身体积较大；
3. 复写组件样式需要使用属性选择器或者使用`styled-components`自带方法。

需要看取舍了，偷偷说一句`styled-components`做主题定制也极其方便。

方案 4 是`antd`使用的这种方案。

在搭建组件库的过程中，有一个问题困扰了我很久：为什么需要`button/style/index.js`引入`less`文件或`button/style/css.js`引入`css`文件？

答案是**管理样式依赖**。

因为我们的组件是没有引入样式文件的，需要使用者去手动引入。

假设存在以下场景：使用者引入`<Button />`，`<Button />`依赖了`<Icon />`，则需要手动去引入调用组件的样式（`<Button />`）及其依赖的组件样式（`<Icon />`），遇到复杂组件极其麻烦，所以组件库开发者可以提供一份这样的`js`文件，使用者手动引入这个`js`文件，就能引入对应组件及其依赖组件的样式。

那么问题又来了，为什么组件不能自己去`import './index.less'`呢？

可以，但业务方需要配置`less-loader`，什么，业务方不想配，要你`import './index.css'`？🙃

可以，业务方爽了，组件开发者不开心。

所以我们要找一个大家都爽的方案：

1. 组件开发者能够开心的使用预处理器；
2. 业务方不需要额外的使用成本。

答案就是：单独提供一份`style/css.js`文件，引入的是组件 `css`样式文件依赖，而非 `less` 依赖，组件库底层抹平差异。

#### 生成 css 文件

安装相关依赖。

```bash
yarn add gulp-less gulp-autoprefixer gulp-cssnano --dev
```

将`less`文件生成对应的`css`文件，在`gulpfile.js`中增加`less2css`任务。

```js
// ...

/**
 * 生成css文件
 */
function less2css() {
  return gulp
    .src(paths.styles)
    .pipe(less()) // 处理less文件
    .pipe(autoprefixer()) // 根据browserslistrc增加前缀
    .pipe(cssnano({ zindex: false, reduceIdents: false })) // 压缩
    .pipe(gulp.dest(paths.dest.lib))
    .pipe(gulp.dest(paths.dest.esm));
}

const build = gulp.parallel(buildScripts, copyLess, less2css);

// ...
```

执行`yarn build`，组件`style`目录下已经存在`css`文件了。

接下来我们需要一个`button/style/css.js`来帮用户引入`css`文件。

#### 生成 css.js

此处参考[antd-tools](https://github.com/ant-design/antd-tools/blob/master/lib/gulpfile.js#L248)的实现方式：在处理`scripts`任务中，截住`style/index.js`，生成`style/css.js`，并通过正则将引入的`less`文件后缀改成`css`。

安装相关依赖。

```bash
yarn add through2 --dev
```

**gulpfile.js**

```js
// ...

/**
 * 编译脚本文件
 * @param {*} babelEnv babel环境变量
 * @param {*} destDir 目标目录
 */
function compileScripts(babelEnv, destDir) {
  const { scripts } = paths;
  process.env.BABEL_ENV = babelEnv;
  return gulp
    .src(scripts)
    .pipe(babel()) // 使用gulp-babel处理
    .pipe(
      through2.obj(function z(file, encoding, next) {
        this.push(file.clone());
        // 找到目标
        if (file.path.match(/(\/|\\)style(\/|\\)index\.js/)) {
          const content = file.contents.toString(encoding);
          file.contents = Buffer.from(cssInjection(content)); // 文件内容处理
          file.path = file.path.replace(/index\.js/, 'css.js'); // 文件重命名
          this.push(file); // 新增该文件
          next();
        } else {
          next();
        }
      })
    )
    .pipe(gulp.dest(destDir));
}

// ...
```

`cssInjection`的实现：

**gulpfile.js**

```js
/**
 * 当前组件样式 import './index.less' => import './index.css'
 * 依赖的其他组件样式 import '../test-comp/style' => import '../test-comp/style/css.js'
 * 依赖的其他组件样式 import '../test-comp/style/index.js' => import '../test-comp/style/css.js'
 * @param {string} content
 */
function cssInjection(content) {
  return content
    .replace(/\/style\/?'/g, "/style/css'")
    .replace(/\/style\/?"/g, '/style/css"')
    .replace(/\.less/g, '.css');
}
```

再进行打包，可以看见组件`style`目录下生成了`css.js`文件，引入的也是上一步`less`转换而来的`css`文件。

**lib/button**

```
├── button.js
├── index.js
├── types.js
└── style
    ├── css.js # 引入index.css
    ├── index.css
    ├── index.js
    └── index.less
```

### 按需加载

在 package.json 中增加`sideEffects`属性，配合`ES module`达到`tree shaking`效果（将样式依赖文件标注为`side effects`，避免被误删除）。

```json
// ...
"sideEffects": [
  "dist/*",
  "esm/**/style/*",
  "lib/**/style/*",
  "*.less"
],
// ...
```

使用以下方式引入，可以做到`js`部分的按需加载，但需要手动引入样式：

```js
import { button } from 'iuc';
import 'iuc/esm/button/style';
```

也可以使用以下方式引入：

```js
import button from 'iuc/esm/button'; // or import button from 'iuc/lib/button';
import 'iuc/esm/button/style'; // or import button from 'iuc/lib/button';
```

以上引入样式文件的方式不太优雅，直接入口处引入**全量**样式文件又和按需加载的本意相去甚远。

使用者可以借助[babel-plugin-import](https://www.npmjs.com/package/babel-plugin-import)来进行辅助，减少代码编写量。

```js
import { button } from 'iuc';
```

⬇️

```js
import button from 'iuc/lib/button';
import 'iuc/lib/button/style';
```

## 标准化发布流程

本节主要是讲解如何通过一行命令完成以下六点内容：

1. 版本更新
2. 生成 CHANGELOG
3. 推送至 git 仓库
4. 组件库打包
5. 发布至 npm
6. 打 tag 并推送至 git

**package.json**

```diff
"scripts": {
+ "release": "ts-node ./scripts/release.ts"
},
```

<details>
<summary>展开查看代码</summary>

```ts
/* eslint-disable  import/no-extraneous-dependencies,@typescript-eslint/camelcase, no-console */
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import util from 'util';
import chalk from 'chalk';
import semverInc from 'semver/functions/inc';
import { ReleaseType } from 'semver';

import pkg from '../package.json';

const exec = util.promisify(child_process.exec);

const run = async (command: string) => {
  console.log(chalk.green(command));
  await exec(command);
};

const currentVersion = pkg.version;

const getNextVersions = (): { [key in ReleaseType]: string | null } => ({
  major: semverInc(currentVersion, 'major'),
  minor: semverInc(currentVersion, 'minor'),
  patch: semverInc(currentVersion, 'patch'),
  premajor: semverInc(currentVersion, 'premajor'),
  preminor: semverInc(currentVersion, 'preminor'),
  prepatch: semverInc(currentVersion, 'prepatch'),
  prerelease: semverInc(currentVersion, 'prerelease'),
});

const timeLog = (logInfo: string, type: 'start' | 'end') => {
  let info = '';
  if (type === 'start') {
    info = `=> 开始任务：${logInfo}`;
  } else {
    info = `✨ 结束任务：${logInfo}`;
  }
  const nowDate = new Date();
  console.log(
    `[${nowDate.toLocaleString()}.${nowDate.getMilliseconds().toString().padStart(3, '0')}] ${info}
    `
  );
};

/**
 * 询问获取下一次版本号
 */
async function prompt(): Promise<string> {
  const nextVersions = getNextVersions();
  const { nextVersion } = await inquirer.prompt([
    {
      type: 'list',
      name: 'nextVersion',
      message: `请选择将要发布的版本 (当前版本 ${currentVersion})`,
      choices: (Object.keys(nextVersions) as Array<ReleaseType>).map((level) => ({
        name: `${level} => ${nextVersions[level]}`,
        value: nextVersions[level],
      })),
    },
  ]);
  return nextVersion;
}

/**
 * 更新版本号
 * @param nextVersion 新版本号
 */
async function updateVersion(nextVersion: string) {
  pkg.version = nextVersion;
  timeLog('修改package.json版本号', 'start');
  await fs.writeFileSync(path.resolve(__dirname, './../package.json'), JSON.stringify(pkg));
  await run('npx prettier package.json --write');
  timeLog('修改package.json版本号', 'end');
}

/**
 * 生成CHANGELOG
 */
async function generateChangelog() {
  timeLog('生成CHANGELOG.md', 'start');
  await run(' npx conventional-changelog -p angular -i CHANGELOG.md -s -r 0');
  timeLog('生成CHANGELOG.md', 'end');
}

/**
 * 将代码提交至git
 */
async function push(nextVersion: string) {
  timeLog('推送代码至git仓库', 'start');
  await run('git add package.json CHANGELOG.md');
  await run(`git commit -m "v${nextVersion}" -n`);
  await run('git push');
  timeLog('推送代码至git仓库', 'end');
}

/**
 * 组件库打包
 */
async function build() {
  timeLog('组件库打包', 'start');
  await run('npm run build');
  timeLog('组件库打包', 'end');
}

/**
 * 发布至npm
 */
async function publish() {
  timeLog('发布组件库', 'start');
  await run('npm publish');
  timeLog('发布组件库', 'end');
}

/**
 * 打tag提交至git
 */
async function tag(nextVersion: string) {
  timeLog('打tag并推送至git', 'start');
  await run(`git tag v${nextVersion}`);
  await run(`git push origin tag v${nextVersion}`);
  timeLog('打tag并推送至git', 'end');
}

async function main() {
  try {
    const nextVersion = await prompt();
    const startTime = Date.now();
    // =================== 更新版本号 ===================
    await updateVersion(nextVersion);
    // =================== 更新changelog ===================
    await generateChangelog();
    // =================== 代码推送git仓库 ===================
    await push(nextVersion);
    // =================== 组件库打包 ===================
    await build();
    // =================== 发布至npm ===================
    await publish();
    // =================== 打tag并推送至git ===================
    await tag(nextVersion);
    console.log(`✨ 发布流程结束 共耗时${((Date.now() - startTime) / 1000).toFixed(3)}s`);
  } catch (error) {
    console.log('💣 发布失败，失败原因：', error);
  }
}

main();
```

</details>

如果你对这一节不感兴趣，也可以直接使用[np](https://www.npmjs.com/package/np)进行发布，需要自定义配置一些钩子。

## 初始化组件

每次初始化一个组件就要新建许多文件（夹），复制粘贴也可，不过还可以使用更高级一点的偷懒方式。

思路如下：

1. 创建组件模板，预留动态信息插槽（组件名称，组件描述等等）；
2. 基于`inquirer.js`询问动态信息；
3. 将信息插入模板，渲染至`src`文件夹下；
4. 向 src/index.ts 插入导出语句。

我们只需要配置好模板以及问题，至于询问以及渲染就交给[plop.js](https://plopjs.com/)吧。

```bash
yarn add plop --dev
```

新增脚本命令。

**package.json**

```diff
"scripts": {
+ "new": "plop --plopfile ./scripts/plopfile.ts",
},
```

新增配置文件以及组件模板，详情可见：

- 配置文件：[scripts/plopfile.ts](https://github.com/WilliamCui31/iuc/blob/master/scripts/plopfile.ts)
- 模板文件：[templates](https://github.com/WilliamCui31/iuc/tree/master/templates)
