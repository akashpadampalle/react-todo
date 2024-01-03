import React, { useEffect, useState } from 'react'
import { Todo } from '../../models/Todo';
import "./createTodoForm.css"

interface CreateTodoFormProps {
    todos: Todo[],
    createFn: (title: string) => Promise<void>
}

const CreateTodoForm: React.FC<CreateTodoFormProps> = ({ todos, createFn }) => {

    const [title, setTitle] = useState("");
    const [error, setError] = useState("");
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {

        const existingTodo = todos.find((todo) => todo.title.trim() == title.trim())

        if (existingTodo) {
            setIsValid(false);
            setError("todo is already exists.");
        }
        else if (title.length == 0) {
            setIsValid(false);
            setError("");
        }
        else if (title.length < 3) {
            setIsValid(false);
            setError("todo title character count should be greater than 2")
        }
        else {
            setIsValid(true);
            setError("");
        }

    }, [title]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        createFn(title);
        setTitle("");
        setError("");
        setIsValid(false);
    }

    return (
        <form onSubmit={handleSubmit} className='create-todo-form'>

            <div className='input-container'>
                {error && <p className='error-message'>{error}*</p>}
                <input type="text" className='input-title' placeholder='create todo....' value={title} onChange={(event) => setTitle(event.target.value)} />
                <input type="submit" className='input-submit' value="create" disabled={!isValid} />
            </div>
        </form>
    )
}

export default CreateTodoForm