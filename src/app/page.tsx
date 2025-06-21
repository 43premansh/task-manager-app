// ✅ FIXED `src/app/create/page.tsx` with Suspense wrapper

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Link from 'next/link';

type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  tags: string[];
  status: 'Todo' | 'In Progress' | 'Done';
  createdAt: string;
};

const NAVBAR = (
  <nav className="flex justify-between items-center py-4 px-6 bg-[#1e1e1e] text-white shadow-md mb-8">
    <h1 className="text-xl font-bold">Task Manager</h1>
    <div className="space-x-4">
      <Link href="/create" className="bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition">Create Task</Link>
    </div>
  </nav>
);

function CreateTaskInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get('id');

  const [task, setTask] = useState<Omit<Task, 'id' | 'tags' | 'createdAt'> & { tags: string }>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    tags: '',
    status: 'Todo',
  });

  const [dueDateObj, setDueDateObj] = useState<Date | null>(null);

  useEffect(() => {
    if (taskId) {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const existing = tasks.find((t: Task) => t.id === taskId);
      if (existing) {
        setTask({
          title: existing.title,
          description: existing.description || '',
          dueDate: existing.dueDate,
          priority: existing.priority,
          tags: existing.tags.join(', '),
          status: existing.status,
        });
        const parsedDate = new Date(existing.dueDate);
        setDueDateObj(!isNaN(parsedDate.getTime()) ? parsedDate : null);
      }
    }
  }, [taskId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const finalDueDate = dueDateObj ? dueDateObj.toISOString().split('T')[0] : '';
    let updatedTasks;

    if (taskId) {
      updatedTasks = storedTasks.map((t: Task) =>
        t.id === taskId
          ? {
              ...t,
              ...task,
              dueDate: finalDueDate,
              tags: task.tags.split(',').map(tag => tag.trim()),
            }
          : t
      );
    } else {
      const newTask: Task = {
        ...task,
        id: crypto.randomUUID(),
        dueDate: finalDueDate,
        tags: task.tags.split(',').map(tag => tag.trim()),
        createdAt: new Date().toISOString(),
      };
      updatedTasks = [...storedTasks, newTask];
    }

    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    alert(taskId ? 'Task updated!' : 'Task created!');
    router.push('/');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{taskId ? 'Edit Task' : 'Create Task'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          required
          placeholder="Title"
          value={task.title}
          className="w-full p-3 border border-gray-600 rounded-xl shadow-sm bg-black text-white"
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={task.description}
          className="w-full p-3 border border-gray-600 rounded-xl shadow-sm bg-black text-white"
          onChange={handleChange}
        />
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm text-white">Due Date</label>
          <DatePicker
            selected={dueDateObj}
            onChange={(date) => {
              setDueDateObj(date);
              if (date) setTask({ ...task, dueDate: date.toISOString().split('T')[0] });
            }}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select due date"
            className="w-full p-3 border border-gray-600 rounded-xl shadow-sm bg-black text-white"
          />
        </div>
        <select
          name="priority"
          value={task.priority}
          className="w-full p-3 border border-gray-600 rounded-xl shadow-sm bg-black text-white"
          onChange={handleChange}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input
          name="tags"
          placeholder="Tags (comma-separated)"
          value={task.tags}
          className="w-full p-3 border border-gray-600 rounded-xl shadow-sm bg-black text-white"
          onChange={handleChange}
        />
        <select
          name="status"
          value={task.status}
          className="w-full p-3 border border-gray-600 rounded-xl shadow-sm bg-black text-white"
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          {taskId ? 'Update Task' : 'Add Task'}
        </button>
      </form>
    </div>
  );
}

export default function CreateTaskPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {NAVBAR}
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <CreateTaskInner />
      </Suspense>
    </div>
  );
}
