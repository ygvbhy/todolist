import { Todo } from './types';
import { getTodos } from './api';
import Todos from './components/Todos';
import AddTodos from './components/AddTodos';

export default function App($app: HTMLElement) {
  const state: { todos: Todo[] } = {
    todos: [],
  };

  const todos = Todos(state.todos);

  const getTotos = async () => {
    const todosData = await getTodos();
    state.todos = todosData;
    todos.todosUpdate(state.todos);
  };

  const render = () => {
    $app.innerHTML = `
    <div class="container mx-auto">
      <div class="mx-auto flex flex-col items-center justify-center h-screen">
        <div class="flex flex-col items-center justify-center h-screen w-[400px]">
          <h1 class="text-2xl font-bold">My Todo List</h1>
          <div id="add-todo"></div>
          <ul id="todos" class="w-full flex flex-col items-center justify-center ring-1 ring-gray-300 rounded-md p-4"></ul>
        </div>
      </div>
    </div>
    `;
  };

  const init = async () => {
    render();
    await getTotos();
    const addTodos = AddTodos(getTotos);
    todos.init();
    addTodos.init();
  };

  return {
    init,
  };
}
