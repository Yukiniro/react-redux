---
id: getting-started
title: 开始使用 React Redux
hide_title: true
sidebar_label: 开始
description: '介绍 > 开始: React Redux 的第一步'
---

&nbsp;

import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'

# 开始使用 React Redux

[React Redux](https://github.com/reduxjs/react-redux) 是 [Redux](https://redux.js.org/) 的官方 [React](https://reactjs.org/) UI 绑定层。这使得你的 React 组件能够从 Redux 的 store 中读取数据，并且向 store 发送 actions 来更新状态。

## 安装

React Redux 8.x 包含 **React 16.8.3 or later** / **React Native 0.59 or later**, 以便使用 React Hooks。

### 使用 Create React App

使用 React 和 Redux 开始新应用的推荐方式是使用官方的 [official Redux+JS 模板](https://github.com/reduxjs/cra-template-redux) 或 [Redux+TS 模板](https://github.com/reduxjs/cra-template-redux-typescript) 创建 React 应用，它利用了 **[Redux Toolkit](https://redux-toolkit.js.org/)** 和 React Redux 与 React 组件的整合。

```bash
# Redux + Plain JS template
npx create-react-app my-app --template redux

# Redux + TypeScript template
npx create-react-app my-app --template redux-typescript
```

### 已经存在的 React 应用

你的 React 应用使用 React Redux，将其作为依赖安装：

```bash
# If you use npm:
npm install react-redux

# Or if you use Yarn:
yarn add react-redux
```

你还需要 [安装 Redux](https://redux.js.org/introduction/installation)，并且在你的应用程序内 [准备一个 Redux store](https://redux.js.org/recipes/configuring-your-store/)。

React-Reudx 的 8.x 版本是使用 TypeScript 编写的，所有的类型会自动包含在其他。

## API 概述

### `Provider`

React Redux 包含一个 `<Provider />` 组件，这使得 Redux store 对你的应用中的其他部分都是可用的。

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'

import { Provider } from 'react-redux'
import store from './store'

import App from './App'

// As of React 18
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

### Hooks

React 提供了一对自定义的 React hooks 来允许你的 React 组件与 Redux store 互动。

`useSelector` 从 store 状态中读取一个值并订阅更新，而 `useDispatch` 返回 store 的 `dispatch` 方法可以让你发送 actions。

```jsx
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  selectCount,
} from './counterSlice'
import styles from './Counter.module.css'

export function Counter() {
  const count = useSelector(selectCount)
  const dispatch = useDispatch()

  return (
    <div>
      <div className={styles.row}>
        <button
          className={styles.button}
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
        <span className={styles.value}>{count}</span>
        <button
          className={styles.button}
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
      </div>
      {/* omit additional rendering output here */}
    </div>
  )
}
```

## 学习 React Redux

### 学习现代 Redux 的现场直播

Redux 的维护者 Mark Erikson 出现在 "Learn with Jason " 节目中，解释了我们今天推荐使用 Redux 的方法。该节目包括一个现场编码的示例应用程序，展示了如何使用 Redux Toolkit 和 React-Redux hooks 与 Typescript，以及新的 RTK Query 数据获取 API。

请参阅 ["学习现代 Redux" 节目说明页面](<(https://www.learnwithjason.dev/let-s-learn-modern-redux)>)，以获取文字记录和示例应用程序源的链接。

<LiteYouTubeEmbed 
    id="9zySeP5vH9c"
    title="Learn Modern Redux - Redux Toolkit, React-Redux Hooks, and RTK Query"
/>

## 帮助和讨论

**[Reactiflux Discord 社区](http://www.reactiflux.com)** 的 **[redux 频道](https://discord.gg/0ZcbPKXt5bZ6au5t)** 是我们学习和使用 Redux 相关问题的官方资源。Reactiflux 是一个闲逛、提问和学习的好地方--来加入我们吧!

你也可以在 [Stack Overflow](https://stackoverflow.com) 上使用 **[#redux tag](https://stackoverflow.com/questions/tagged/redux)** 来问问题。

## 文档翻译

- [葡萄牙语](https://fernandobelotto.github.io/react-redux)
