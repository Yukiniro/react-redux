---
id: connect
title: '教程: Connect API'
hide_title: true
sidebar_label: '教程: Connect API'
description: '教程 > Connect API: 如何使用传统的 connect API'
---

&nbsp;

# 教程: 使用 `connect` API

:::tip

We now recommend using [the React-Redux hooks API as the default](../api/hooks.md). However, the `connect` API still works fine.

我们推荐使用 [React-Redux hooks API 作为默认](../api/hooks.md)。然而， `connect` API 仍然可以正常工作

本教程还展示了一些我们不再推荐的旧做法，如按类型将 Redux 逻辑分离到文件夹。为了完整起见，我们保留了本教程，但建议阅读 Redux 文档中的 [the "Redux Essentials" tutorial](https://redux.js.org/tutorials/essentials/part-1-overview-concepts) 和 [Redux Style Guide](https://redux.js.org/style-guide/style-guide)，了解我们当前的最佳实践。

我们正在编写一个新的教程，将介绍 hooks 的 API。在那之前，我们建议阅读[**Redux Fundamentals, Part 5: UI and React**](https://redux.js.org/tutorials/fundamentals/part-5-ui-react)作为 hooks 教程。

:::

为了了解如何在实践中使用 React Redux，我们将通过创建一个 todo list 应用来展示一个逐步的例子。

## Todo List 示例

**Jump to**

- 🤞 [Just show me the code](https://codesandbox.io/s/9on71rvnyo)
- 👆 [Providing the store](#providing-the-store)
- ✌️ [Connecting the Component](#connecting-the-components)

**React UI 组件**

我们已经实现了我们的 React UI 组件，如下所示：

- `TodoApp` 是我们 APP 的入口组件。它会渲染头部、 `AddTodo`、 `TodoList` and `VisibilityFilters` 组件.
- `AddTodo` 是一个组件，它允许用户输入一个待办事项，并在点击其 “Add Todo” 按钮后添加到列表中：

  - 它使用一个的受控的输入框，并通过 `onChange` 设置状态。
  - 当用户点击 "Add Todo"按钮时，它将派发 action（我们将使用 React Redux 提供），将待办事项添加到 store。

- `TodoList` 是渲染 todos 列表的组件。:
  - 它在 `VisibilityFilters` 的某一个选项被选中时渲染过滤后的待办列表。
- `Todo` 是渲染单个待办事项的组件:
  - 它渲染了 todo 的内容，并通过划掉它来显示一个 todo 已经完成。
  - 它在 "onClick "时派发 action，以切换 todo 的完整状态。
- `VisibilityFilters` 渲染一组简单的过滤器: _all_, _completed_, and _incomplete._ 点击上面的任何一个都会过滤掉一些待办事项:
  - It accepts an `activeFilter` prop from the parent that indicates which filter is currently selected by the user. An active filter is rendered with an underscore.
  - 它接受来自父级的 `activeFilter` 属性，表示用户当前选择了哪个过滤器。一个激活的过滤器会用下划线表示。
  - 它发送 `setFilter` 的 action 来更新所选的过滤器。
- `constants` 存放我们应用程序的常量数据。
- 最后 `index` 将我们的应用程序渲染到 DOM。

<br />

**Redux 的 store**

应用程序的 Redux 部分已经使用[Redux 文档中推荐的模式](https://redux.js.org)进行了设置。

- Store
  - `todos`: 一个标准的 todos 的 reducer。它包含一个所有 todos 的 `byIds` 映射和一个包含所有 id 列表的 `allIds`。
  - `visibilityFilters`: 值为 `all`，`completed` 或者 `incomplete` 的简单的字符串。
- Action Creators
  - `allTodo` 创建了一个用于添加待办事项的 action。它接收一个字符串变量 `content`，并返回一个 `ADD_TODO` action，`payload` 包含一个自我增加的 `id` 和 `content`。
  - `toggleTodo` 创建了一个用于切换待办事项是否完成的 action。它接受一个单一的数字变量`id` 并返回一个 `TOGGLE_TODO` action，`payload` 只包含 `id`。
  - `setFilter`创建了一个用于设置应用程序过滤器的激活状态的 action。它接收一个字符串变量 `filter` 并返回一个 `SET_FILTER` action，`payload` 包含 `filter` 本身。
- Reducers
  - The `todos` reducer
    - 在收到 `ADD_TODO` 动作后，将 `id` 添加到其 `allIds` 字段，并在其 `byIds` 字段中设置 todo。
    - 在收到 `TOGGLE_TODO` 动作时，切换该任务的 `completed` 字段。
  - The `visibilityFilters` reducer sets its slice of store to the new filter it receives from the `SET_FILTER` action payload
  - `visibilityFilters` reducer 将它的 store 片设置为它从 `SET_FILTER` action 中收到的新过滤器。
- Action Types
  - 我们使用一个文件 `actionTypes.js` 来保存要重复使用的动作类型的常量。
- Selectors
  - `getTodoList` 从 `todos` 的 store 中返回 `allIds` 的列表
  - `getTodoById` 通过 `id` 返回 store 中的待办事项
  - `getTodos` 稍微复杂一些。它从 `allIds` 中获取所有的 `id`，在 `byIds` 中找到每个待办事项，并返回最后的代办事项的数组。
  - `getTodosByVisibilityFilter` 通过激活的 filter 过滤待办事项

你可以查看[这个 CodeSandbox](https://codesandbox.io/s/6vwyqrpqk3)，了解上述 UI 组件和未连接的 Redux store 的源代码。

<br />

现在我们将展示如何使用 React Redux 将这个 store 连接到我们的应用程序。

### Providing the Store

首先，我们需要使 `store` 对我们的应用程序可用。为了做到这一点，我们用 React Redux 提供的 `<Provider />` API 来包装我们的应用程序。

```jsx
// index.js
import React from 'react'
import ReactDOM from 'react-dom'
import TodoApp from './TodoApp'

import { Provider } from 'react-redux'
import store from './redux/store'

// As of React 18
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <TodoApp />
  </Provider>
)
```

注意我们的`<TodoApp />`现在被`<Provider />`包裹，`store`作为一个道具被传入。

![](https://i.imgur.com/LV0XvwA.png)

### 连接组件

React Redux 为你提供了一个 `connect` 方法从 Redux store 中读取值（在 store 更新后重新读取）。

`connect` 方法接受两个参数，都是可选的：

- `mapStateToProps`: 每次 store 状态改变时都会被调用。它接收整个 store 的状态，并应返回该组件需要的数据对象。
- `mapDispatchToProps`: 这个参数可以是一个函数，也可以是一个对象。
  - 如果它是一个函数，它将在组件创建时被调用一次。它将接收`dispatch'作为参数，并应返回一个使用`dispatch'来分配 action 的函数的对象。
  - 如果它是一个由 action creators 组成的对象，每个 action creator 将被变成一个 prop 函数，在被调用时自动发送其 action。**注意**。我们推荐使用这种 "对象速记" 形式。

通常情况下，你会以这种方式调用 `connect`:

```js
const mapStateToProps = (state, ownProps) => ({
  // ... computed data from state and optionally ownProps
})

const mapDispatchToProps = {
  // ... normally is an object full of action creators
}

// `connect` returns a new function that accepts the component to wrap:
const connectToStore = connect(mapStateToProps, mapDispatchToProps)
// and that function returns the connected, wrapper component:
const ConnectedComponent = connectToStore(Component)

// We normally do both in one step, like this:
connect(mapStateToProps, mapDispatchToProps)(Component)
```

让我们先研究一下 `<AddTodo />`。它需要触发对 `store` 的改变，以添加新的 todos。因此，它需要能够 `dispatch` action 到 store。下面是我们如何做的。

我们的 `addTodo` action creator 看起来像这样。

```js
// redux/actions.js
import { ADD_TODO } from './actionTypes'

let nextTodoId = 0
export const addTodo = (content) => ({
  type: ADD_TODO,
  payload: {
    id: ++nextTodoId,
    content,
  },
})

// ... other actions
```

通过把它传递给 `connect`，我们的组件就会把它作为一个道具来接收，当它被调用时，它就会自动分配动作。

```js
// components/AddTodo.js

// ... other imports
import { connect } from 'react-redux'
import { addTodo } from '../redux/actions'

class AddTodo extends React.Component {
  // ... component implementation
}

export default connect(null, { addTodo })(AddTodo)
```

现在注意到，`<AddTodo />` 被包裹在一个叫做 `<Connect(AddTodo) />` 的父组件中。同时，`<AddTodo />` 现在获得了一个道具：`addTodo` action。

![](https://i.imgur.com/u6aXbwl.png)

我们还需要实现 `handleAddTodo` 函数，让它调度 `addTodo` action 并重置输入。

```jsx
// components/AddTodo.js

import React from 'react'
import { connect } from 'react-redux'
import { addTodo } from '../redux/actions'

class AddTodo extends React.Component {
  // ...

  handleAddTodo = () => {
    // dispatches actions to add todo
    this.props.addTodo(this.state.input)

    // sets state back to empty string
    this.setState({ input: '' })
  }

  render() {
    return (
      <div>
        <input
          onChange={(e) => this.updateInput(e.target.value)}
          value={this.state.input}
        />
        <button className="add-todo" onClick={this.handleAddTodo}>
          Add Todo
        </button>
      </div>
    )
  }
}

export default connect(null, { addTodo })(AddTodo)
```

现在我们的 `<AddTodo />` 已经连接到 store。当我们添加一个待办事项时，它将派发一个 action 来改变 store。我们在应用中没有看到它，因为其他组件还没有连接。如果你已经连接 了 Redux DevTools 扩展，你应该看到 action 被分派：

![](https://i.imgur.com/kHvkqhI.png)

你还应该看到，store 也有相应的变化：

![](https://i.imgur.com/yx27RVC.png)

`<TodoList />` 组件负责渲染 todos 的列表。因此，它需要从 store 中读取数据。我们通过调用 `connect` 和`mapStateToProps` 参数来启用它，该参数是一个描述我们需要从 store 获得哪一部分数据的函数。

我们的 `<Todo />` 组件把 todo 项作为 props。我们从 `todos` 的 `byIds` 字段中获得这一信息。然而，我们还需要来自 store 的 `allIds` 字段的信息，表明哪些 todos 和它们应该被呈现的顺序。我们的 `mapStateToProps` 函数可能看起来像这样：

```js
// components/TodoList.js

// ...other imports
import { connect } from "react-redux";

const TodoList = // ... UI component implementation

const mapStateToProps = state => {
  const { byIds, allIds } = state.todos || {};
  const todos =
    allIds && allIds.length
      ? allIds.map(id => (byIds ? { ...byIds[id], id } : null))
      : null;
  return { todos };
};

export default connect(mapStateToProps)(TodoList);
```

幸运的是，我们有一个选择器，正是这样做的。我们可以简单地导入选择器并在这里使用它。

```js
// redux/selectors.js

export const getTodosState = (store) => store.todos

export const getTodoList = (store) =>
  getTodosState(store) ? getTodosState(store).allIds : []

export const getTodoById = (store, id) =>
  getTodosState(store) ? { ...getTodosState(store).byIds[id], id } : {}

export const getTodos = (store) =>
  getTodoList(store).map((id) => getTodoById(store, id))
```

```js
// components/TodoList.js

// ...other imports
import { connect } from "react-redux";
import { getTodos } from "../redux/selectors";

const TodoList = // ... UI component implementation

export default connect(state => ({ todos: getTodos(state) }))(TodoList);
```

我们建议在 selector 函数中封装任何复杂的查找或者数据的计算。此外，你可以通过使用[Reselect](https://github.com/reduxjs/reselect)来编写 "memoized" selectors，跳过不必要的工作，进一步优化性能。(参见[the Redux docs page on Computing Derived Data](https://redux.js.org/recipes/computing-derived-data#sharing-selectors-across-multiple-components)和博文[Idiomatic Redux: Using Reselect Selectors for Encapsulation and Performance](https://blog.isquaredsoftware.com/2017/12/idiomatic-redux-using-reselect-selectors/)，以了解为什么以及如何使用选择器函数的更多信息)。

现在，我们的 `<TodoList />` 已经连接到 store。它应该接收 todos 的列表，映射它们，并将每个 todo 传递给 `<Todo />` 组件。`<Todo />` 将反过来把它们渲染到屏幕上。现在试着添加一个 todo。它应该会出现在我们的待办事项列表中!

![](https://i.imgur.com/N68xvrG.png)

我们将连接更多的组件。在这之前，让我们暂停一下，先了解一下 `connect` 的情况。

### 调用 `connect` 的常见方法

根据你所使用的组件类型，有不同的方式来调用 `connect`，最常见的方式总结如下：

|                        | 不订阅 store                                   | 订阅 Store                                                |
| ---------------------- | ---------------------------------------------- | --------------------------------------------------------- |
| 不暴露 Action Creators | `connect()(Component)`                         | `connect(mapStateToProps)(Component)`                     |
| 暴露 Action Creators   | `connect(null, mapDispatchToProps)(Component)` | `connect(mapStateToProps, mapDispatchToProps)(Component)` |

#### 不订阅 store 且不暴露 action creators

如果你调用 `connect` 而不提供任何参数，你的组件将：

- store 变化时 _不会_ 进行重新渲染
- 接收 `props.dispatch`，你可以手动派发 action

```js
// ... Component
export default connect()(Component) // Component will receive `dispatch` (just like our <TodoList />!)
```

#### 订阅 store 但是不暴露 action creators

如果你只用 `mapStateToProps` 来调用 `connect`，你的组件会：

- subscribe to the values that `mapStateToProps` extracts from the store, and re-render only when those values have changed
- 订阅 `mapStateToProps` 从 store 提取的值，只有当这些值发生变化时才重新渲染。
- 接收 `props.dispatch`，你可以手动派发 action

```js
// ... Component
const mapStateToProps = (state) => state.partOfState
export default connect(mapStateToProps)(Component)
```

#### 不订阅 store 但是暴露 action creators

如果你只用 `mapDispatchToProps` 来调用 `connect`，你的组件会：

- 当商店发生变化时，_不会_ 重新渲染。
- 接收你用 `mapDispatchToProps` 注入的每个 action creators 作为 props，并在被调用时自动派发 action。

```js
import { addTodo } from './actionCreators'
// ... Component
export default connect(null, { addTodo })(Component)
```

#### 订阅 store 并且暴露 action creators

如果你用 `mapStateToProps` 和 `mapDispatchToProps` 调用 `connect`，你的组件将：

- 订阅 `mapStateToProps` 从 store 提取的值，只有当这些值发生变化时才重新渲染。
- 接收你用 `mapDispatchToProps` 注入的每个 action creators 作为 props，并在被调用时自动派发 action。

```js
import * as actionCreators from './actionCreators'
// ... Component
const mapStateToProps = (state) => state.partOfState
export default connect(mapStateToProps, actionCreators)(Component)
```

These four cases cover the most basic usages of `connect`. To read more about `connect`, continue reading our [API section](../api/connect.md) that explains it in more detail.

这四种情况涵盖了 `connect` 的最基本用法。要了解更多关于 `connect` 的信息，请继续阅读我们的[API 部分](.../api/connect.md)，其中有更详细的解释。

<!-- TODO: 放上进一步解释连接的页面链接 -->

---

现在让我们来连接我们的 `<TodoApp />` 的其余部分。

我们应该如何实现切换 todos 的交互？一个敏锐的读者可能已经有了答案。如果你已经建立了你的环境，并且一直贯彻到现在，现在是一个好时机，可以把它放在一边，自己实现这个功能。如果我们把我们的 `<Todo />` 连接起来，以类似的方式调度 `toggleTodo`，那就没有什么奇怪的了。

```js
// components/Todo.js

// ... other imports
import { connect } from "react-redux";
import { toggleTodo } from "../redux/actions";

const Todo = // ... component implementation

export default connect(
  null,
  { toggleTodo }
)(Todo);
```

现在我们的 todo 可以切换完成。我们就快成功了!

![](https://i.imgur.com/4UBXYtj.png)

最后，让我们实现我们的 `VisibilityFilters` 功能。

`<VisibilityFilters />` 组件需要能够从 store 读取当前激活的过滤器，并向 store 派发 action。因此，我们需要传递一个 `mapStateToProps` 和 `mapDispatchToProps`。这里的 `mapStateToProps` 可以是 `visibilityFilter` 状态的一个简单访问器。而 `mapDispatchToProps` 将包含 `setFilter` 动作创建者。

```js
// components/VisibilityFilters.js

// ... other imports
import { connect } from "react-redux";
import { setFilter } from "../redux/actions";

const VisibilityFilters = // ... component implementation

const mapStateToProps = state => {
  return { activeFilter: state.visibilityFilter };
};
export default connect(
  mapStateToProps,
  { setFilter }
)(VisibilityFilters);
```

Meanwhile, we also need to update our `<TodoList />` component to filter todos according to the active filter. Previously the `mapStateToProps` we passed to the `<TodoList />` `connect` function call was simply the selector that selects the whole list of todos. Let’s write another selector to help filtering todos by their status.

同时，我们还需要更新我们的 `<TodoList />` 组件，以根据活动过滤器过滤 todos。之前我们传递给 `<TodoList />` `connect `函数调用的 `mapStateToProps` 只是选择器，它选择了整个 todos 的列表。让我们再写一个选择器来帮助按状态过滤 todos。

```js
// redux/selectors.js

// ... other selectors
export const getTodosByVisibilityFilter = (store, visibilityFilter) => {
  const allTodos = getTodos(store)
  switch (visibilityFilter) {
    case VISIBILITY_FILTERS.COMPLETED:
      return allTodos.filter((todo) => todo.completed)
    case VISIBILITY_FILTERS.INCOMPLETE:
      return allTodos.filter((todo) => !todo.completed)
    case VISIBILITY_FILTERS.ALL:
    default:
      return allTodos
  }
}
```

并在 selector 的帮助下连接到 store:

```js
// components/TodoList.js

// ...

const mapStateToProps = (state) => {
  const { visibilityFilter } = state
  const todos = getTodosByVisibilityFilter(state, visibilityFilter)
  return { todos }
}

export default connect(mapStateToProps)(TodoList)
```

现在我们已经完成了一个非常简单的使用 React Redux 的 todo 应用程序的例子。我们所有的组件都被连接起来了 这不是很好吗？🎉🎊

![](https://i.imgur.com/ONqer2R.png)

## Links

- [Usage with React](https://redux.js.org/basics/usage-with-react)
- [Using the React Redux Bindings](https://blog.isquaredsoftware.com/presentations/workshops/redux-fundamentals/react-redux.html)
- [Higher Order Components in Depth](https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e)
- [Computing Derived Data](https://redux.js.org/recipes/computing-derived-data#sharing-selectors-across-multiple-components)
- [Idiomatic Redux: Using Reselect Selectors for Encapsulation and Performance](https://blog.isquaredsoftware.com/2017/12/idiomatic-redux-using-reselect-selectors/)

## Get More Help

- [Reactiflux](https://www.reactiflux.com) Redux channel
- [StackOverflow](https://stackoverflow.com/questions/tagged/react-redux)
- [GitHub Issues](https://github.com/reduxjs/react-redux/issues/)
