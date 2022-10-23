---
id: why-use-react-redux
title: 为什么使用 React Redux?
hide_title: true
sidebar_label: 为什么使用 React Redux?
description: '介绍 > 为什么使用 React Redux: 在 React 应用中使用 React Redux 的好处'
---

&nbsp;

# 为什么使用 React Redux?

Redux 本身是一个独立的库，可以与任何 UI 层或框架一起使用，包括 React、Angular、Vue、Ember 和 vanilla JS。虽然 Redux 和 React 通常一起使用，但它们是相互独立的。

如果你将 Redux 与任何类型的 UI 框架一起使用，你通常会使用一个 "UI 绑定" 库将 Redux 与你的 UI 框架联系在一起，而不是直接从你的 UI 代码与 store 进行交互。

**React Redux 是 React 的官方 Redux UI 绑定库**。如果你同时使用 Redux 和 React，你也应该使用 React Redux 来绑定这两个库。

为了理解为什么你应该使用 React Redux，理解一下 "UI 绑定库" 的作用可能会有所帮助。

:::info

如果你对是否应该普遍使用 Redux 有疑问，请看这些文章，讨论什么时候和为什么要使用 Redux，以及如何使用它的目的。

- [Redux docs: Motivation](https://redux.js.org/introduction/motivation)
- [Redux docs: FAQ - When should I use Redux?](https://redux.js.org/faq/general#when-should-i-use-redux)
- [You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)
- [Idiomatic Redux: The Tao of Redux, Part 1 - Implementation and Intent](https://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-1/)

:::

## 将 Redux 与 UI 整合在一起

在 _任何_ UI 层中使用 Redux 都需要[相同的步骤](https://blog.isquaredsoftware.com/presentations/workshops/redux-fundamentals/ui-layer.html#/4):

1. 创建一个 Redux store
2. 订阅更新
3. 在订阅回调里面:
   1. 获取当前 store 的状态
   2. 提取这块用户界面所需的数据
   3. 用这些数据更新用户界面
4. 如果有必要，用初始状态渲染用户界面
5. 通过发送 Redux actions 来响应 UI 的输入

虽然有可能用手写这种逻辑，但这样做会变得非常重复。此外，优化用户界面的性能也需要复杂的逻辑。

订阅 store、检查更新的数据和触发重新渲染的过程可以变得更加通用和可重用。**像 React Redux 这样的 UI 绑定库可以处理 store 的交互逻辑，所以你不必自己写这些代码**。

:::info

要深入了解 React Redux 的内部工作方式以及它如何为你处理 store 的交互，请看 **[Idiomatic Redux: The History and Implementation of React Redux](https://blog.isquaredsoftware.com/2018/11/react-redux-history-implementation/)**。

:::

## 使用 React Redux 的原因

### 它是 React 的官方 Redux UI 绑定。

虽然 Redux 可以与任何 UI 层一起使用，但它最初是为 React 设计的，并打算与 React 一起使用。目前[有许多其他框架的 UI 绑定层](https://redux.js.org/introduction/ecosystem#library-integration-and-bindings)，但 React Redux 是由 Redux 团队直接维护的。

作为 React 的官方 Redux 绑定，React Redux 与任何一个库的 API 变化保持同步，以确保你的 React 组件的行为符合预期。它的预期用途采用了 React 的设计原则--编写声明式组件。

### 它为你实施性能优化

React 的速度一般都很快，但默认情况下，对一个组件的任何更新都会导致 React 重新渲染组件树中该部分的所有组件。这确实需要工作，如果一个给定的组件的数据没有改变，那么重新渲染很可能是一些性能上的浪费，因为最后的 UI 输出会是一样的。

如果性能是一个问题，提高性能的最好方法是跳过不必要的重新渲染，这样，组件只有在其数据实际发生变化时才会重新渲染。**React Redux 在内部实现了许多性能优化，因此你自己的组件只在真正需要的时候才重新渲染。**

此外，通过在你的 React 组件树中连接多个组件，你可以确保每个连接的组件只从 store 的状态中提取该组件需要的特定数据片断。这意味着你自己的组件需要重新渲染的次数会减少，因为大多数时候这些特定的数据片断并没有改变。

### 社区支持

作为 React 和 Redux 的官方绑定库，React Redux 有一个庞大的用户社区。这使得寻求帮助、学习最佳实践、使用建立在 React Redux 之上的库，以及在不同的应用程序中重复使用你的知识变得更加容易。

## 链接和参考资料

### 理解 React Redux

- [Idiomatic Redux: The History and Implementation of React Redux](https://blog.isquaredsoftware.com/2018/11/react-redux-history-implementation/)
- [`connect.js` Explained](https://gist.github.com/gaearon/1d19088790e70ac32ea636c025ba424e)
- [Redux Fundamentals workshop slides](https://blog.isquaredsoftware.com/2018/06/redux-fundamentals-workshop-slides/)
  - [UI Layer Integration](https://blog.isquaredsoftware.com/presentations/workshops/redux-fundamentals/ui-layer.html)
  - [Using React Redux](https://blog.isquaredsoftware.com/presentations/workshops/redux-fundamentals/react-redux.html)

### 社区资源

- Discord channel: [#redux on Reactiflux](https://discord.gg/0ZcbPKXt5bZ6au5t) ([Reactiflux invite link](https://reactiflux.com))
- Stack Overflow topics: [Redux](https://stackoverflow.com/questions/tagged/redux), [React Redux](https://stackoverflow.com/questions/tagged/redux)
- Reddit: [/r/reactjs](https://www.reddit.com/r/reactjs/), [/r/reduxjs](https://www.reddit.com/r/reduxjs/)
- GitHub issues (bug reports and feature requests): https://github.com/reduxjs/react-redux/issues
- Tutorials, articles, and further resources: [React/Redux Links](https://github.com/markerikson/react-redux-links)
