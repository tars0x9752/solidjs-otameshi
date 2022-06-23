import { Component, For } from 'solid-js';

import styles from './App.module.css';

const App: Component = () => {
  const list = [
    {
      id: 1,
      text: 'asdf',
    },
    {
      id: 2,
      text: 'yoyoyo',
    },
    {
      id: 3,
      text: 'hogehoge'
    }
  ]

  return (
    <div class={styles.app}>
      <header>
        <h1>Todo list</h1>
      </header>
      <main>
        <ul>
          <For each={list}>
            {(item) => {
              return <li>{item.text}</li>
            }}
          </For>
        </ul>
      </main>
    </div>
  );
};

export default App;
