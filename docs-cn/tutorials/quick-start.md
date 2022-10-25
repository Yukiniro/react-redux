---
id: quick-start
title: 快速开始
sidebar_label: 快速开始
hide_title: true
---

&nbsp;

# 快速开始 React Redux

:::tip 你将要学到的

- 如何用 React Redux 设置和使用 Redux Toolkit

:::

:::info 先决条件

- 熟悉 [ES6 语法和特征](https://www.taniarascia.com/es6-syntax-and-feature-overview/)
- 了解 React 术语: [JSX](https://reactjs.org/docs/introducing-jsx.html), [State](https://reactjs.org/docs/state-and-lifecycle.html), [Function Components, Props](https://reactjs.org/docs/components-and-props.html), and [Hooks](https://reactjs.org/docs/hooks-intro.html)
- 了解[Redux 术语和概念](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow)

:::

## 介绍

欢迎来到 React Redux 快速入门教程! **本教程将向你简要介绍 React Redux，并教你如何开始正确使用它**。

### 如何阅读这个教程

本页将重点介绍如何用 Redux Toolkit 建立一个 Redux 应用程序以及你将使用的主要 API。关于什么是 Redux，它是如何工作的解释，以及如何使用 Redux 工具包的完整例子，请参见[the Redux core docs tutorials](https://redux.js.org/tutorials/index)。

在本教程中，我们假设你正在使用 Redux Toolkit 和 React Redux，因为那是标准的 Redux 使用模式。这些例子是基于[a typical Create-React-App folder structure](https://create-react-app.dev/docs/folder-structure)，其中所有的应用程序代码都在 `src` 中，但这些模式可以适应你使用的任何项目或文件夹设置。

[Redux+JS 的 Create-React-App 模板](https://github.com/reduxjs/cra-template-redux)已经配置了这个相同的项目设置。

## 使用摘要

### 安装 Redux Toolkit 和 React Redux

将 Redux Toolki 和 React Redux 的包放进你的项目中：

```sh
npm install @reduxjs/toolkit react-redux
```

### 创建 Redux Store

创建一个名为 `src/app/store.js` 的文件。从 Redux ToolKit 导入 `configureStore` API。我们将首先创建一个空的 Redux store，并将其导出。

```js title="app/store.js"
import { configureStore } from '@reduxjs/toolkit'

export default configureStore({
  reducer: {},
})
```

这将创建一个 Redux store，同时自动配置 Redux DevTools 扩展，这样你就可以在开发时检查该 store。

### 向 React 提供 Redux Store

一旦 store 被创建，我们可以通过在 `src/index.js` 中的应用程序周围放置 React Redux `<Provider>`，使其对我们的 React 组件可用。导入我们刚刚创建的 Redux store，在你的 `<App>` 周围放一个 `<Provider>` ，并将 store 作为一个 prop 传递:

```js title="index.js"
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
// highlight-start
import store from './app/store'
import { Provider } from 'react-redux'
// highlight-end

// As of React 18
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  // highlight-next-line
  <Provider store={store}>
    <App />
  </Provider>
)
```

### 创建一个 Redux 的状态片段

添加一个名为 `src/features/counter/counterSlice.js` 的新文件。在该文件中，从 Redux Toolkit 中导入 `createSlice` API。

创建一个片断需要一个字符串名称来标识该片断，一个初始状态值，以及一个或多个 reducer 函数来定义如何更新状态。一旦一个片断被创建，我们可以导出生成的 Redux action creators 和整个片断的 reducer 函数。

Redux 要求[我们通过制作数据的副本和更新副本，不可更改地编写所有状态更新](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow#immutability)。然而，Redux 工具包的`createSlice`和`createReducer` APIs 在里面使用了[Immer](https://immerjs.github.io/immer/)，允许我们[编写 "变异 "更新逻辑，成为正确的不可更改的更新](https://redux.js.org/tutorials/fundamentals/part-8-modern-redux#immutable-updates-with-immer)。

```js title="features/counter/counterSlice.js"
import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default counterSlice.reducer
```

### 在 store 中添加片段 reducers

接下来，我们需要从计数器分片中导入还原器函数，并将其添加到我们的存储中。通过在 `reducers` 参数内定义一个字段，我们告诉商店使用这个分片的 reducer 函数来处理该状态的所有更新。

```js title="app/store.js"
import { configureStore } from '@reduxjs/toolkit'
// highlight-next-line
import counterReducer from '../features/counter/counterSlice'

export default configureStore({
  reducer: {
    // highlight-next-line
    counter: counterReducer,
  },
})
```

### 在 React 组件中使用 Redux 的 state 和 action

现在我们可以使用 React Redux hooks 来让 React 组件与 Redux store 互动。我们可以用 `useSelector` 从 store 读取数据，用 `useDispatch` 派发 action。创建一个`src/features/counter/Counter.js`文件，里面有一个 `<Counter>` 组件，然后将该组件导入 `App.js` 并在 `<App>` 中渲染。

```jsx title="features/counter/Counter.js"
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from './counterSlice'
import styles from './Counter.module.css'

export function Counter() {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  )
}
```

现在，任何时候你点击 "Increment" 和 "Decrement" 按钮：

- 相应的 Redux action 将被派发到 store
- 计数器片断 reducer 将看到 action 并更新其 state
- `<Counter>` 组件将从 store 看到新的 state，并以新的数据重新渲染自己。

## 你所能学到的

以上是对如何在 React 中设置和使用 Redux 工具包的简要概述。重新总结一下细节：

:::tip 摘要

- **通过 `configureStore` 创建 Redux store**
  - `configureStore` 接受一个 `reducer` 函数作为命名参数
  - `configureStore` 自动设置好默认设置的 store
- **为 React 应用组件提供 Redux store**
  - 在你的 `<App />` 周围放一个 React Redux 的 `<Provider>` 组件
  - 将 Redux store 作为`<Provider store={store}>`来传递
- **通过 `createSlice` 创建一个 Redux “片段” reducer**
  - 用一个字符串名称、初始状态和命名的 reducer 函数调用 `createSlice`
  - reducer 函数可以使用 Immer "mutate" state
  - 输出生成的片断 reducer 和 action creators
- **在 React 组件中使用 React Redux `useSelector/useDispatch` hooks**
  - 用`useSelector` hooks 从 store 读取数据
  - 用 `useDispatch` hooks 获取 `dispatch` 函数，并根据需要派发 action

:::

### 完整的计数器应用实例

这里显示的计数器示例应用程序也是

下面是作为运行中的 CodeSandbox 的完整计数器应用程序：

<iframe
  class="codesandbox"
  src="https://codesandbox.io/embed/github/reduxjs/redux-essentials-counter-example/tree/master/?fontsize=14&hidenavigation=1&module=%2Fsrc%2Ffeatures%2Fcounter%2FcounterSlice.js&theme=dark&runonclick=1"
  title="redux-essentials-example"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

## 下一步是什么？

我们建议通过[**Redux 核心文档中的 "Redux Essentials" 和 "Redux Fundamentals" 教程**](https://redux.js.org/tutorials/index)，这将使你全面了解 Redux 的工作原理，Redux Toolkit 和 React Redux 的作用，以及如何正确使用它。
