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

We recommend encapsulating any complex lookups or computations of data in selector functions. In addition, you can further optimize the performance by using [Reselect](https://github.com/reduxjs/reselect) to write “memoized” selectors that can skip unnecessary work. (See [the Redux docs page on Computing Derived Data](https://redux.js.org/recipes/computing-derived-data#sharing-selectors-across-multiple-components) and the blog post [Idiomatic Redux: Using Reselect Selectors for Encapsulation and Performance](https://blog.isquaredsoftware.com/2017/12/idiomatic-redux-using-reselect-selectors/) for more information on why and how to use selector functions.)

Now that our `<TodoList />` is connected to the store. It should receive the list of todos, map over them, and pass each todo to the `<Todo />` component. `<Todo />` will in turn render them to the screen. Now try adding a todo. It should come up on our todo list!

![](https://i.imgur.com/N68xvrG.png)

We will connect more components. Before we do this, let’s pause and learn a bit more about `connect` first.

### Common ways of calling `connect`

Depending on what kind of components you are working with, there are different ways of calling `connect` , with the most common ones summarized as below:

|                               | Do Not Subscribe to the Store                  | Subscribe to the Store                                    |
| ----------------------------- | ---------------------------------------------- | --------------------------------------------------------- |
| Do Not Inject Action Creators | `connect()(Component)`                         | `connect(mapStateToProps)(Component)`                     |
| Inject Action Creators        | `connect(null, mapDispatchToProps)(Component)` | `connect(mapStateToProps, mapDispatchToProps)(Component)` |

#### Do not subscribe to the store and do not inject action creators

If you call `connect` without providing any arguments, your component will:

- _not_ re-render when the store changes
- receive `props.dispatch` that you may use to manually dispatch action

```js
// ... Component
export default connect()(Component) // Component will receive `dispatch` (just like our <TodoList />!)
```

#### Subscribe to the store and do not inject action creators

If you call `connect` with only `mapStateToProps`, your component will:

- subscribe to the values that `mapStateToProps` extracts from the store, and re-render only when those values have changed
- receive `props.dispatch` that you may use to manually dispatch action

```js
// ... Component
const mapStateToProps = (state) => state.partOfState
export default connect(mapStateToProps)(Component)
```

#### Do not subscribe to the store and inject action creators

If you call `connect` with only `mapDispatchToProps`, your component will:

- _not_ re-render when the store changes
- receive each of the action creators you inject with `mapDispatchToProps` as props and automatically dispatch the actions upon being called

```js
import { addTodo } from './actionCreators'
// ... Component
export default connect(null, { addTodo })(Component)
```

#### Subscribe to the store and inject action creators

If you call `connect` with both `mapStateToProps` and `mapDispatchToProps`, your component will:

- subscribe to the values that `mapStateToProps` extracts from the store, and re-render only when those values have changed
- receive all of the action creators you inject with `mapDispatchToProps` as props and automatically dispatch the actions upon being called.

```js
import * as actionCreators from './actionCreators'
// ... Component
const mapStateToProps = (state) => state.partOfState
export default connect(mapStateToProps, actionCreators)(Component)
```

These four cases cover the most basic usages of `connect`. To read more about `connect`, continue reading our [API section](../api/connect.md) that explains it in more detail.

<!-- TODO: Put up link to the page that further explains connect -->

---

Now let’s connect the rest of our `<TodoApp />`.

How should we implement the interaction of toggling todos? A keen reader might already have an answer. If you have your environment set up and have followed through up until this point, now is a good time to leave it aside and implement the feature by yourself. There would be no surprise that we connect our `<Todo />` to dispatch `toggleTodo` in a similar way:

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

Now our todo’s can be toggled complete. We’re almost there!

![](https://i.imgur.com/4UBXYtj.png)

Finally, let’s implement our `VisibilityFilters` feature.

The `<VisibilityFilters />` component needs to be able to read from the store which filter is currently active, and dispatch actions to the store. Therefore, we need to pass both a `mapStateToProps` and `mapDispatchToProps`. The `mapStateToProps` here can be a simple accessor of the `visibilityFilter` state. And the `mapDispatchToProps` will contain the `setFilter` action creator.

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

And connecting to the store with the help of the selector:

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

Now we've finished a very simple example of a todo app with React Redux. All our components are connected! Isn't that nice? 🎉🎊

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
