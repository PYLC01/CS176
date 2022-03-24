import React from 'react';
import ReactDOM from 'react-dom';
import TodoApp from './component/TodoApp';

function App() {
  ReactDOM.render(
    <React.StrictMode>
      <TodoApp />
    </React.StrictMode>,
    document.getElementById('root'),
  );
}
export default App;
