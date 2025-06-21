'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

export default function CreateTask() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get('id');

  const [task, setTask] = useState({
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
        if (!isNaN(parsedDate.getTime())) {
        setDueDateObj(parsedDate);
        } else {
         setDueDateObj(null); // fallback
        }

      }
    }
  }, [taskId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    let updatedTasks;

    const finalDueDate = dueDateObj ? dueDateObj.toISOString().split('T')[0] : '';

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
        id: crypto.randomUUID(),
        title: task.title,
        description: task.description,
        dueDate: finalDueDate,
        priority: task.priority as 'Low' | 'Medium' | 'High',
        tags: task.tags.split(',').map(tag => tag.trim()),
        status: task.status as 'Todo' | 'In Progress' | 'Done',
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
          className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-blue-500"
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={task.description}
          className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-blue-500"
          onChange={handleChange}
        />
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm">Due Date</label>
          <DatePicker
            selected={dueDateObj}
            onChange={(date) => {
              setDueDateObj(date);
              if (date) setTask({ ...task, dueDate: date.toISOString().split('T')[0] });
            }}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select due date"
            className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-blue-500"
          />
        </div>

        <select
          name="priority"
          value={task.priority}
          className="w-full p-3 border border-gray-300 rounded-xl shadow-sm"
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
          className="w-full p-3 border border-gray-300 rounded-xl shadow-sm"
          onChange={handleChange}
        />

        <select
          name="status"
          value={task.status}
          className="w-full p-3 border border-gray-300 rounded-xl shadow-sm"
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
