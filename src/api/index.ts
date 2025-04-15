const API_URL = import.meta.env.VITE_API_URL;
import { Todo } from '../types';

const request = async (
  method: string,
  body?: Partial<Todo>,
  id: string = ''
) => {
  try {
    const res = await fetch(`${API_URL}/todos/${id}`, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });

    if (!res.ok) {
      throw new Error('Failed To Fetch Todos');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    alert('Failed To Fetch Todos');
  }
};

const getTodos = async () => {
  try {
    const data = await request('GET');
    return data;
  } catch (error) {
    console.error(error);
    alert('Failed To Fetch Todos');
  }
};

const createTodo = async (text: string) => {
  try {
    const res = await request('POST', { text, completed: false });
    return res;
  } catch (error) {
    console.error(error);
    alert('Failed To Create Todo');
  }
};

const deleteTodo = async (id: string) => {
  try {
    const res = await request('DELETE', {}, id);
    return res;
  } catch (error) {
    console.error(error);
    alert('Failed To Delete Todo');
  }
};

const updateTodo = async (id: string, text: string, completed: boolean) => {
  try {
    const res = await request('PUT', { text, completed }, id);
    return res;
  } catch (error) {
    console.error(error);
    alert('Failed To Update Todo');
  }
};

export { updateTodo, deleteTodo, getTodos, createTodo };
