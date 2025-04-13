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

        input.addEventListener('click', handleChange);
        $todo.addEventListener('click', clickChangeText);
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

  const clickChangeText = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.target as HTMLElement;
    if (target.tagName !== 'LABEL') return;

    const parent = target.parentElement!;
    const id = parent.dataset.id!;
    const $input = document.createElement('input');
    $input.type = 'text';
    $input.value = target.textContent!;
    $input.className =
      'w-4 ms-2 my-2 h-4 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 w-full flex items-center hover:ring-1 hover:ring-gray-300 cursor-pointer p-2 rounded-md hover:shadow-md';

    const saveEdit = async () => {
      const newText = $input.value.trim();
      const todo = state.todos.find((t) => t.id === id);
      if (!todo || !newText) return;

      state.todos = state.todos.map((t) =>
        t.id === id ? { ...t, text: newText } : t
      );
      await handleUpdate(id, newText, todo.completed);
      render();
    };

    $input.addEventListener('keydown', async (e) => {
      if ((e as KeyboardEvent).key === 'Enter') {
        await saveEdit();
      }
    });

    $input.addEventListener('blur', async () => {
      await saveEdit();
    });

    parent.replaceChild($input, target);
    $input.focus();
  };

  const handleChange = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    const input = e.target as HTMLInputElement;
    const id = input.parentElement!.dataset.id!;

    const text = input.parentElement!.querySelector('label')!.textContent!;
    let completed = false;
    state.todos = state.todos.map((t) => {
      if (t.id === id) {
        completed = !t.completed;
        return { ...t, completed };
      }
      return t;
    });

    await handleUpdate(id, text, completed);
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
    const completed = state.todos.find((t) => t.id === id)?.completed;

    if (!completed) {
      const confirm = window.confirm(
        '아직 완료하지 않은 TODO 입니다. \n삭제하시겠습니까?'
      );
      if (!confirm) {
        return;
      }
    }

    state.todos = state.todos.filter((t) => t.id !== id);
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
