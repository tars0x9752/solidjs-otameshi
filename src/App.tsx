import { Component, For, Show, Switch, Match, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'

import styles from './App.module.css'

type TaskStatus = 'todo' | 'wip' | 'done'

type Task = {
  id: string
  taskText: string
  status: TaskStatus
  targetAt?: string
  doneAt?: string
}

const todoList: Task[] = [
  {
    id: '1',
    status: 'todo',
    targetAt: '2022-6-26',
    taskText: 'hoge',
  },
  {
    id: '2',
    status: 'todo',
    targetAt: '2022-6-26',
    taskText: 'fuga',
  },
  {
    id: '3',
    status: 'todo',
    taskText: 'foo',
  },
]

const wipList: Task[] = [
  {
    id: '4',
    status: 'wip',
    taskText: 'yoyo',
  },
]

const doneList: Task[] = [
  {
    id: '5',
    status: 'done',
    doneAt: '2022-06-01',
    taskText: 'hoho',
  },
  {
    id: '6',
    status: 'done',
    doneAt: '2022-06-02',
    taskText: 'zxzx',
  },
]

type TaskItemProps = Task & {
  onUpdateStatus: (toBe: Task['status'], id: Task['id']) => void
}

const TaskItem: Component<TaskItemProps> = props => {
  return (
    <div>
      <p>
        <b>task:</b> {props.taskText}
        <Show when={props.targetAt}>
          {_targetAt => {
            return (
              <>
                <br />
                <b>target:</b> {_targetAt}
              </>
            )
          }}
        </Show>
        <Show when={props.doneAt}>
          {_doneAt => {
            return (
              <>
                <br />
                <b>done:</b> {_doneAt}
              </>
            )
          }}
        </Show>
        <Switch>
          <Match when={props.status === 'todo'}>
            <br />
            <button
              onClick={() => {
                props.onUpdateStatus('wip', props.id)
              }}
            >
              wip
            </button>
            <button
              onClick={() => {
                props.onUpdateStatus('done', props.id)
              }}
            >
              done
            </button>
          </Match>
          <Match when={props.status === 'wip'}>
            <br />
            <button
              onClick={() => {
                props.onUpdateStatus('done', props.id)
              }}
            >
              done
            </button>
          </Match>
        </Switch>
      </p>
    </div>
  )
}

type TaskItemListProps = { list: Task[]; onUpdateStatus: TaskItemProps['onUpdateStatus'] }

const TaskItemList: Component<TaskItemListProps> = props => {
  return (
    <For each={props.list}>
      {item => {
        return <TaskItem {...item} onUpdateStatus={props.onUpdateStatus} />
      }}
    </For>
  )
}

type AddTaskFormProps = { onClick: (text: string) => void }

const AddTaskForm: Component<AddTaskFormProps> = props => {
  const [text, setText] = createSignal('')

  return (
    <>
      <input
        type="text"
        placeholder="todo"
        value={text()}
        onInput={e => {
          setText((e.target as HTMLInputElement).value)
        }}
      />
      <button
        onClick={() => {
          const t = text().trim()

          props.onClick(t)

          setText('')
        }}
      >
        add
      </button>
    </>
  )
}

const App: Component = () => {
  const [state, setStore] = createStore({
    todoList,
    wipList,
    doneList,
  })

  const handleAddTask = (text: string) => {
    setStore('todoList', prev => {
      const _todoList: Task[] = [
        ...prev,
        { id: new Date().toISOString(), taskText: text, status: 'todo' },
      ]
      return _todoList
    })
  }

  const handleUpdateStatus = (toBe: Task['status'], id: Task['id']) => {
    const all = [...state.todoList, ...state.wipList, ...state.doneList].map(v => {
      if (v.id !== id) {
        return v
      }

      return {
        ...v,
        status: toBe,
      }
    })

    setStore({
      todoList: all.filter(v => v.status === 'todo'),
      wipList: all.filter(v => v.status === 'wip'),
      doneList: all.filter(v => v.status === 'done'),
    })
  }

  return (
    <div class={styles.app}>
      <header>
        <h1>Mini Todo</h1>
      </header>
      <main>
        <div>
          <h2>Add A Task</h2>
          <AddTaskForm onClick={handleAddTask} />
        </div>
        <div>
          <h2>Todo List</h2>
          <TaskItemList list={state.todoList} onUpdateStatus={handleUpdateStatus} />
        </div>
        <div>
          <h2>Wip List</h2>
          <TaskItemList list={state.wipList} onUpdateStatus={handleUpdateStatus} />
        </div>
        <div>
          <h2>Done List</h2>
          <TaskItemList list={state.doneList} onUpdateStatus={handleUpdateStatus} />
        </div>
      </main>
    </div>
  )
}

export default App
