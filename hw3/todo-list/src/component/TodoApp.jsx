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
            arr1_todoItems.push(text);
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
let check_count = 0;
let completed_index = [];

function TodoItem() {
  const { Item, setItem } = React.useContext(Context);
  arr2_todoItems = Item.todoItems;
  if (arr2_todoItems.length != 0) {
    return (
      <section className="items">
        <ul className="todoItem" id="todoItem">
          {Item.todoItems.map((item, index) => (
            <li key={index} id={index.toString()}>
              <input
                className="toggle"
                type="checkbox"
                id={`${index.toString()}a`}
                onChange={() => {
                  if (document.getElementById(`${index.toString()}a`).checked) {
                    document.getElementById(index.toString()).className =
                      'completed';
                    arr2_todoItems = Item.todoItems;
                    setItem({
                      todoItems: arr2_todoItems,
                      itemCount: Item.itemCount - 1,
                    });
                    completed_index.push({ index });
                    check_count += 1;
                    if (check_count == 1) {
                      creatButton(Item, setItem);
                    }
                  } else {
                    document.getElementById(index.toString()).className = '';
                    arr2_todoItems = Item.todoItems;
                    setItem({
                      todoItems: arr2_todoItems,
                      itemCount: Item.itemCount + 1,
                    });
                    check_count -= 1;
                    if (check_count == 0) {
                      deleteButton();
                    }
                  }
                }}></input>
              <label>{item}</label>
              <button
                className="destroy"
                type="button"
                onClick={() => {
                  arr2_todoItems.splice({ index }, 1);
                  if (document.getElementById(`${index.toString()}a`).checked) {
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

function creatButton(Item, setItem) {
  const todoFooter = document.getElementById('footer');
  const button = document.createElement('input');
  button.setAttribute('type', 'button');
  button.setAttribute('id', 'clear-completed');
  button.setAttribute('value', 'clear completed');
  button.setAttribute('class', 'clear-completed');
  todoFooter.appendChild(button);
  button.onClick = {
    clear_completed() {
      for (let i = 0; i < completed_index.length; ++i) {
        arr2_todoItems.splice(i, 1);
        setItem({
          todoItems: arr2_todoItems,
          itemCount: Item.itemCount - 1,
        });
      }
      completed_index = [];
    },
  };
}

function deleteButton() {
  const todoFooter = document.getElementById('footer');
  const button = document.getElementById('clear-completed');
  todoFooter.removeChild(button);
}

/* function clear_completed(arr2_todoItems, Item, setItem, completed_index) {
  console.log('clear');
  for (let i = 0; i < completed_index.length; ++i) {
    arr2_todoItems.splice({ i }, 1);
    setItem({
      todoItems: arr2_todoItems,
      itemCount: Item.itemCount - 1,
    });
  }
} */
