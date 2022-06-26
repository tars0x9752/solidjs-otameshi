import { Component, For, Show, Switch, Match } from 'solid-js';
import { createStore } from 'solid-js/store';

import styles from './App.module.css';

type TaskStatus = 'todo' | 'wip' | 'done'

type Task = {
  id: string;
  taskText: string;
  status: TaskStatus;
  targetAt?: string;
  doneAt?: string;
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
  }
]

const wipList: Task[] = [
  {
    id: '4',
    status: 'wip',
    taskText: 'yoyo',
  }
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
  }
]

const TaskItem: Component<Task> = (props) => {
  // const { status, taskText, targetAt, doneAt } = task;

  return <div>
    <p><b>task:</b> {props.taskText}
      <Show when={props.targetAt}>
        {
          (_targetAt) => {
            return <><br /><b>target:</b> {_targetAt}</>
          }
        }
      </Show>
      <Show when={props.doneAt}>
        {
          (_doneAt) => {
            return <><br /><b>done:</b> {_doneAt}</>
          }
        }
      </Show>
      <Switch>
        <Match when={props.status === "todo"}>
          <br />
          <button onClick={() => {
            console.log('yo')
          }}>wip</button>
          <button onClick={() => { }}>done</button>
        </Match>
        <Match when={props.status === "wip"}>
          <br />
          <button>done</button>
        </Match>
      </Switch>
    </p>
  </div>
}

const TaskItemList: Component<{ list: Task[] }> = (props) => {
  return (
    <For each={props.list}>
      {
        (item) => {
          return <TaskItem {...item} />
        }
      }
    </For>
  )
}

const AddTaskForm: Component<{ onClick: (id: string) => void }> = ({ onClick }) => {
  return <><button onClick={() => {
    onClick('6')
  }}>add</button></>
}

const Pu: Component<{ fuga: number }> = (props) => {
  return <p>{props.fuga}</p>
}

const App: Component = () => {
  const [state, setStore] = createStore({
    todoList,
    wipList,
    doneList,
    hoge: {
      fuga: 1
    }
  })

  const handle = () => {
    setStore('hoge', 'fuga', (prev) => {
      return prev + 1
    }
    )
    setStore('todoList', 0, 'taskText', 'updated')
    console.log('handle')
  }


  return (
    <div class={styles.app}>
      <header>
        <h1>Mini Todo {state.hoge.fuga}</h1>
        <Pu fuga={state.hoge.fuga} />
      </header>
      <main>
        <div>
          <h2>Add A Task</h2>
          <AddTaskForm onClick={handle} />
        </div>
        <div>
          <h2>Todo List</h2>
          <TaskItemList list={state.todoList} />
        </div>
        <div>
          <h2>Wip List</h2>
          <TaskItemList list={state.wipList} />
        </div>
        <div>
          <h2>Done List</h2>
          <TaskItemList list={state.doneList} />
        </div>
      </main>
    </div>
  );
};

export default App;
