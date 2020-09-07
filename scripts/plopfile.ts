/* eslint-disable  import/no-extraneous-dependencies */
import { NodePlopAPI } from 'plop';
import path from 'path';

export default function (plop: NodePlopAPI) {
  plop.setGenerator('component', {
    description: '创建一个新组件',
    prompts: [
      { type: 'input', name: 'name', message: '请输入组件名称（多个单词以中横线命名）' },
      { type: 'input', name: 'CN', message: '请输入组件中文名称' },
      { type: 'input', name: 'description', message: '请输入组件描述' },
    ],
    actions: [
      {
        type: 'add',
        path: path.resolve(__dirname, '../src/{{kebabCase name}}/index.ts'),
        templateFile: path.resolve(__dirname, '../templates/index.hbs'),
      },
      {
        type: 'add',
        path: path.resolve(__dirname, '../src/{{kebabCase name}}/{{kebabCase name}}.tsx'),
        templateFile: path.resolve(__dirname, '../templates/component.hbs'),
      },
      {
        type: 'add',
        path: path.resolve(__dirname, '../src/{{kebabCase name}}/style/index.less'),
        templateFile: path.resolve(__dirname, '../templates/style/style.hbs'),
      },
      {
        type: 'add',
        path: path.resolve(__dirname, '../src/{{kebabCase name}}/style/index.ts'),
        templateFile: path.resolve(__dirname, '../templates/style/index.hbs'),
      },
      {
        type: 'add',
        path: path.resolve(__dirname, '../src/{{kebabCase name}}/index.md'),
        templateFile: path.resolve(__dirname, '../templates/md.hbs'),
      },
      {
        type: 'add',
        path: path.resolve(__dirname, '../src/{{kebabCase name}}/types.ts'),
        templateFile: path.resolve(__dirname, '../templates/types.hbs'),
      },
      {
        type: 'add',
        path: path.resolve(__dirname, '../src/{{kebabCase name}}/__tests__/index.test.tsx'),
        templateFile: path.resolve(__dirname, '../templates/__tests__/index.test.hbs'),
      },
      {
        type: 'append',
        path: path.resolve(__dirname, '../src/index.ts'),
        template: "export { default as {{pascalCase name}} } from './{{kebabCase name}}';",
      },
    ],
  });
}