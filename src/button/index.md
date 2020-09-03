---
title: Button
---

# 这是 Button 组件

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
