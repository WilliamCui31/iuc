---
title: Button
---

# Button 按钮

按钮用于开始一个即时操作。

## 代码演示

```tsx
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
```
## API
| 属性  | 说明       | 类型                                                               | 默认值     |
| ---- | ----       | ---                                                               | --------- |
| type | 设置按钮类型 | `primary` \| `ghost` \| `dashed` \| `link` \| `text` \| `default` | `default` |
| size | 设置按钮大小 | `large` \| `middle` \| `small `                                   | `default` |