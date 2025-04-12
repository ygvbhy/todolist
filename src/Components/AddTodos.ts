import { createTodo } from '../api';

export default function AddTodos(handleGetTodos: () => Promise<void>) {
  const $target = document.getElementById('add-todo');

  const render = () => {
    if (!$target) {
      throw new Error('AddTodo element not found');
    }

    $target.className = `flex flex-col items-center justify-center`;
    const $addTodo = document.createElement('div');
    $addTodo.className = `flex flex-row items-center justify-center`;
    const inputDiv = document.createElement('div');
    inputDiv.className = `my-4`;

    const button = document.createElement('button');
    button.id = 'add-todo-btn';
    button.type = 'button';
    button.className = `cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 ms-2`;
    button.textContent = '추가';
    button.addEventListener('click', addTodo);

    const $input = document.createElement('input');
    $input.className = `bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`;
    $input.placeholder = '코딩 공부';
    inputDiv.appendChild($input);
    $addTodo.appendChild(inputDiv);
    $addTodo.appendChild(button);
    $target.appendChild($addTodo);
  };

  const addTodo = async (e: Event) => {
    e.preventDefault();
    const $input = document.querySelector('input') as HTMLInputElement;
    if (!$input) {
      throw new Error('Input element not found');
    }
    const inputValue = $input.value;
    const res = await createTodo(inputValue);
    console.log(res);

    $input.value = '';
    await handleGetTodos();
  };

  const init = () => {
    render();
  };

  return {
    init,
  };
}
