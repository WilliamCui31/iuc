// @ts-nocheck
import { ApplyPluginsType } from '/Users/williamcui/.nvm/versions/node/v14.4.0/lib/node_modules/dumi/node_modules/@umijs/runtime';
import { plugin } from './plugin';

export function getRoutes() {
  const routes = [
  {
    "path": "/",
    "component": (props) => require('react').createElement(require('../../../../../.nvm/versions/node/v14.4.0/lib/node_modules/dumi/node_modules/@umijs/preset-dumi/lib/themes/default/layout.js').default, {
      ...{"menus":{"*":{"*":[{"path":"/","title":"首页","meta":{}},{"title":"组件","path":"/button","meta":{},"children":[{"path":"/button","title":"Button","meta":{}}]}]}},"locales":[],"navs":{},"title":"iuc","mode":"doc"},
      ...props,
    }),
    "routes": [
      {
        "path": "/",
        "component": require('../../index.md').default,
        "exact": true,
        "meta": {
          "filePath": "src/index.md",
          "updatedTime": 1598517170243,
          "title": "首页",
          "slugs": [
            {
              "depth": 1,
              "value": "这是首页",
              "heading": "这是首页"
            }
          ]
        },
        "title": "首页"
      },
      {
        "path": "/button",
        "component": require('../../button/index.md').default,
        "exact": true,
        "meta": {
          "filePath": "src/button/index.md",
          "updatedTime": 1599045306219,
          "group": {
            "title": "组件",
            "path": "/button"
          },
          "title": "Button",
          "slugs": [
            {
              "depth": 1,
              "value": "这是 Button 组件",
              "heading": "这是-button-组件"
            }
          ]
        },
        "title": "Button"
      }
    ],
    "title": "iuc"
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
