import React, { useEffect, useState } from 'react';
import { Todo } from '../../models/Todo';
import axios, { AxiosError } from 'axios';
import Spinner from '../spinner/Spinner';
import "./todoList.css"
import TodoItem from '../todo-item/TodoItem';
import CreateTodoForm from '../create-todo/CreateTodoForm';

const TodoList: React.FC = () => {

  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<AxiosError>();
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    const abortSigle = axios.CancelToken.source();

    const fetchTodos = async () => {

      try {

        setLoading(true);
        const response = await axios.get<Todo[]>("https://jsonplaceholder.typicode.com/todos", { cancelToken: abortSigle.token });
        setTodos(response.data);
        setError(undefined);

      } catch (error) {

        if (error instanceof AxiosError) {
          setError(error);
        }

      } finally {

        setLoading(false);

      }
    };

    fetchTodos();

    return () => abortSigle.cancel("Request canceled by cleanup");
  }, []);

  const deleteFn = async (id: number) => {

    // const oldTodos = todos;
    const newTodos = todos.filter((todo) => todo.id != id);

    setTodos(newTodos);

    try {
      await axios.delete("https://jsonplaceholder.typicode.com/todos/" + id);
    } catch (error) {
      // setTodos(oldTodos);
      console.log(error)
    }

  }

  const checkFn = async (id: number) => {

    // const oldTodos = todos;

    let targetedTodo: Todo | null = null;

    const newTodos = todos.map((todo) => {
      if (todo.id == id) {
        targetedTodo = { ...todo, completed: !todo.completed };
        return targetedTodo;
      }

      return todo;

    });

    setTodos(newTodos);

    try {
      if (targetedTodo){
        await axios.put("https://jsonplaceholder.typicode.com/todos/" + id, targetedTodo);
      }
    } catch (error) {
      // setTodos(oldTodos);
      console.log(error)
    }

  }


  const createFn = async (title: string) => {
    const oldTodos = todos;

    const todoObj: Todo = { userId: 1, id: todos.length + 3, completed: false, title };

    console.log(todoObj)

    setTodos([todoObj, ...todos]);

    try {
      await axios.post("https://jsonplaceholder.typicode.com/todos/");
    } catch (error) {
      setTodos(oldTodos);
    }

  }

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return <div className='todo-error'>{error.message}</div>
  }

  return (
    <div>
      <h1 className='todo-list-title'>Todo List</h1>
      {
        (todos.length > 0) &&
        (
          <ul className='todo-list'>
            {todos.map(todo => <TodoItem key={todo.id} todo={todo} deleteFn={deleteFn} checkFn={checkFn} />)}
          </ul>
        )
      }
      <div className='create-todo-container'><CreateTodoForm todos={todos} createFn={createFn} /> </div>
    </div>
  );
}

export default TodoList;