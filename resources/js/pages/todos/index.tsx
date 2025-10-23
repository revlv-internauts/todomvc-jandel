import React, { useState } from 'react'
import { Head, Form, router, Link } from '@inertiajs/react'
import { X } from 'lucide-react'

export default function Index({ todos }) {
  const [task, setTask] = useState('')
  const [loadingIds, setLoadingIds] = useState(new Set())

  const toggleComplete = (todo) => {
    setLoadingIds(prev => new Set(prev).add(todo.id))
    router.put(`/todos/${todo.id}`, {
      completed_at: todo.completed_at ? null : new Date().toISOString(),
    }, {
      onFinish: () => setLoadingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(todo.id)
        return newSet
      }),
    })
  }

  const completed = todos.filter(t => t.completed_at).length

  return (
    <div className="p-4 max-w-md mx-auto">
      <Head title="TODO MVC" />

      {/* Inertia Form with controlled input */}
      <Form
        action="/todos"
        method="post"
        onSubmit={() => setTask('')}
        className="mb-4 flex gap-2"
      >
        <input
          type="text"
          name="task"
          value={task}
          onChange={e => setTask(e.target.value)}
          placeholder="Add new task"
          className="flex-grow p-3 border-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="New task"
        />
        <button
          type="submit"
          disabled={!task.trim()}
          className="bg-blue-600 text-white px-4 rounded disabled:opacity-50"
          aria-disabled={!task.trim()}
        >
          Add
        </button>
      </Form>

      <ul className="space-y-2">
        {todos.map(todo => (
          <li
            key={todo.id}
            className={`flex items-center gap-2 p-3 border-2 rounded transition-colors ${
              todo.completed_at ? 'bg-gray-100' : 'bg-white'
            }`}
          >
            <input
              type="checkbox"
              checked={!!todo.completed_at}
              disabled={loadingIds.has(todo.id)}
              onChange={() => toggleComplete(todo)}
              className="w-6 h-6 cursor-pointer"
              aria-label={`Mark task "${todo.task}" as completed`}
            />
            <span
              className={`flex-1 select-none ${
                todo.completed_at ? 'line-through text-gray-500' : ''
              }`}
            >
              {todo.task}
            </span>
            <Link href={`/todos/${todo.id}`} method="delete" as="button" className="p-1 rounded hover:bg-orange-600 hover:text-white transition">
              <X aria-label={`Delete task "${todo.task}"`} />
            </Link>
          </li>
        ))}
      </ul>

      <div className="w-full border-2 p-3 rounded mt-4 text-center text-sm text-gray-700">
        Completed: {completed} | Pending: {todos.length - completed} | Total: {todos.length}
      </div>
    </div>
  )
}
