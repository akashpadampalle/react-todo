import React from 'react';
import { Todo } from '../../models/Todo';
import { MdDeleteOutline } from "react-icons/md";
import "./todoItem.css"

interface TodoItemProps {
    todo: Todo,
    deleteFn: (id: number) => Promise<void>,
    checkFn: (id: number) => Promise<void>
};

const TodoItem: React.FC<TodoItemProps> = ({ todo, deleteFn, checkFn }) => {
    return (
        <li className='todo-list-item'>
            <input type="checkbox" checked={todo.completed} onChange={() => checkFn(todo.id)}/>
            <span className={(todo.completed) ? "cut-though" : ""}>{todo.title}</span>
            <div className='delete-button' onClick={() => deleteFn(todo.id)}><MdDeleteOutline /></div>
        </li>
    );
};

export default TodoItem;