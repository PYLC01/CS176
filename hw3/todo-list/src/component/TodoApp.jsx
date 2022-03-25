/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable camelcase */
/* eslint-disable eqeqeq */
import React, { useState } from 'react';
import '../App.css';

export const Context = React.createContext();

const initialState = {
  todoItems: [],
  itemCount: 0,
};

function TodoApp() {
  const [Item, setItem] = useState(initialState);
  return (
    <body>
      <section className="todoapp">
        <section className="TodoHeaders">
          <h1 className="TodoAppHeader">todos</h1>
        </section>
        <section className="TodoContexts">
          <Context.Provider value={{ Item, setItem }}>
            <React.StrictMode>
              <TodoList />
            </React.StrictMode>
            <React.StrictMode>
              <TodoItem />
            </React.StrictMode>
          </Context.Provider>
        </section>
      </section>
      <footer className="Info">
        <p>Double click to edit a to-do</p>
        <p>
          Created by <a href="https://github.com/PYLC01">Li Chao</a>
        </p>
      </footer>
    </body>
  );
}

export default TodoApp;

const arr1_todoItems = [];
let total_count = 0;

function TodoList() {
  const { Item, setItem } = React.useContext(Context);
  return (
    <input
      className="new-todo"
      id="new-todo"
      placeholder="What needs to be done?"
      onKeyDown={() => {
        if (event.keyCode == 13) {
          const text = document.getElementById('new-todo').value;
          if (text != '') {
            document.getElementById('new-todo').value = '';
            total_count += 1;
            arr1_todoItems.push({ content: text, unique_id: total_count });
            setItem({
              todoItems: arr1_todoItems,
              itemCount: Item.itemCount + 1,
            });
          }
        }
      }}></input>
  );
}

let arr2_todoItems = [];

function TodoItem() {
  const { Item, setItem } = React.useContext(Context);
  if (Item.todoItems.length != 0) {
    return (
      <section className="items">
        <ul className="todoItem" id="todoItem">
          {Item.todoItems.map((item, index) => (
            <li key={index} id={item.unique_id.toString()}>
              <input
                className="toggle"
                type="checkbox"
                id={`${item.unique_id.toString()}a`}
                onChange={() => {
                  if (
                    document.getElementById(`${item.unique_id.toString()}a`)
                      .checked
                  ) {
                    document.getElementById(
                      item.unique_id.toString(),
                    ).className = 'completed';
                    arr2_todoItems = Item.todoItems;
                    setItem({
                      todoItems: arr2_todoItems,
                      itemCount: Item.itemCount - 1,
                    });
                  } else {
                    document.getElementById(
                      item.unique_id.toString(),
                    ).className = '';
                    arr2_todoItems = Item.todoItems;
                    setItem({
                      todoItems: arr2_todoItems,
                      itemCount: Item.itemCount + 1,
                    });
                  }
                }}></input>
              <label>{item.content}</label>
              <button
                className="destroy"
                type="button"
                onClick={() => {
                  const checked = document.getElementById(
                    `${item.unique_id.toString()}a`,
                  ).checked
                    ? 1
                    : 0;
                  document.getElementById(item.unique_id.toString()).className =
                    'deleted';
                  if (checked) {
                    setItem({
                      todoItems: arr2_todoItems,
                      itemCount: Item.itemCount,
                    });
                  } else {
                    setItem({
                      todoItems: arr2_todoItems,
                      itemCount: Item.itemCount - 1,
                    });
                  }
                }}></button>
            </li>
          ))}
        </ul>
        <footer className="footer" id="footer">
          <span className="todo-count">
            <strong>{Item.itemCount}</strong> item left
          </span>
        </footer>
      </section>
    );
  } else {
    return <ul></ul>;
  }
}
