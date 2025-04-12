import { Todo } from '../types';
import { deleteTodo, updateTodo } from '../api';

export default function Todos(todos: Todo[]) {
  const state: { todos: Todo[] } = {
    todos,
  };

  const todosUpdate = (todos: Todo[]) => {
    state.todos = todos;
    render();
  };

  const render = () => {
    const $todos = document.getElementById('todos');
    if (!$todos) {
      throw new Error('Todos element not found');
    }

    $todos.innerHTML = '';
    if (state.todos.length === 0) {
      const $todo = document.createElement('li');
      $todo.textContent = '등록된 할일이 없습니다.';
      $todos.appendChild($todo);
    } else {
      state.todos.forEach((todo) => {
        const $todo = document.createElement('li');
        const input = document.createElement('input');
        $todo.dataset.id = todo.id.toString();
        $todo.className =
          'flex items-center mb-4 w-full hover:ring-1 hover:ring-gray-300 cursor-pointer p-2 rounded-md hover:shadow-md';
        input.className =
          'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500';
        input.type = 'checkbox';
        input.checked = todo.completed;

        $todo.addEventListener('click', handleChange);
        const label = document.createElement('label');
        label.className =
          'ms-2 text-sm font-medium text-gray-900 w-full cursor-pointer';
        label.textContent = todo.text;
        if (todo.completed) {
          label.classList.add('line-through');
        }
        $todo.appendChild(input);
        $todo.appendChild(label);
        $todos.appendChild($todo);

        const deleteButton = document.createElement('button');
        deleteButton.dataset.id = todo.id.toString();
        deleteButton.className = `cursor-pointer text-xs focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg px-5 py-2 w-20`;
        deleteButton.type = 'button';
        deleteButton.textContent = '삭제';
        deleteButton.addEventListener('click', handleDelete);

        $todo.appendChild(deleteButton);
      });
    }
  };

  const handleChange = async (e: Event) => {
    e.preventDefault();
    const input = e.target as HTMLInputElement;
    const id = input.parentElement!.dataset.id!;

    // text 가져오기
    const text = input.parentElement!.querySelector('label')!.textContent!;
    state.todos = state.todos.map((t) =>
      (t.id as unknown as string) === id ? { ...t, completed: !t.completed } : t
    );

    await handleUpdate(id, text, input.checked);
    render();
  };

  const handleUpdate = async (id: string, text: string, completed: boolean) => {
    try {
      await updateTodo(id, text, completed);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (e: Event) => {
    e.preventDefault();

    const id = (e.target as HTMLButtonElement).dataset.id;

    state.todos = state.todos.filter((t) => (t.id as unknown as string) !== id);
    await deleteTodo(id!);
    render();
  };

  const init = () => {
    render();
  };

  return {
    init,
    todosUpdate,
  };
}
