'use client';

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import NavBar from '../components/NavBar';

type Task = {
  id?: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: string;
  tags: string[] | string;
  status: string;
  createdAt?: string;
};

export default function CreateTask() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get('id');

  const [task, setTask] = useState<Omit<Task, 'id' | 'createdAt'>>({
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
      const tasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
      const existing = tasks.find((t: Task) => t.id === taskId);
      if (existing) {
        setTask({
          title: existing.title,
          description: existing.description || '',
          dueDate: existing.dueDate,
          priority: existing.priority,
          tags: Array.isArray(existing.tags) ? existing.tags.join(', ') : existing.tags,
          status: existing.status,
        });
        const parsedDate = new Date(existing.dueDate);
        setDueDateObj(!isNaN(parsedDate.getTime()) ? parsedDate : null);
      }
    }
  }, [taskId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const finalDueDate = dueDateObj
      ? dueDateObj.toISOString().split('T')[0]
      : task.dueDate;

    const storedTasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
    let updatedTasks: Task[];

    if (taskId) {
      updatedTasks = storedTasks.map((t: Task) =>
        t.id === taskId
          ? {
              ...t,
              ...task,
              dueDate: finalDueDate,
              tags: (typeof task.tags === 'string'
                ? task.tags
                : (task.tags as string[]).join(', ')
              )
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0),
            }
          : t
      );
    } else {
      const newTask: Task = {
        ...task,
        id: crypto.randomUUID(),
        dueDate: finalDueDate,
        tags: (typeof task.tags === 'string'
          ? task.tags
          : (task.tags as string[]).join(', ')
        )
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0),
        createdAt: new Date().toISOString(),
      };
      updatedTasks = [...storedTasks, newTask];
    }

    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    alert(taskId ? 'Task updated!' : 'Task created!');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <NavBar />
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
            autoComplete="off"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={task.description}
            className="w-full p-3 border border-gray-600 rounded-xl shadow-sm bg-black text-white"
            onChange={handleChange}
            autoComplete="off"
          />
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm text-white">Due Date</label>
            <DatePicker
              selected={dueDateObj}
              onChange={(date: Date | null) => {
                setDueDateObj(date);
                if (date)
                  setTask((prevTask) => ({
                    ...prevTask,
                    dueDate: date.toISOString().split('T')[0],
                  }));
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
            autoComplete="off"
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
    </div>
  );
}
