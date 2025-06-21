'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import NavBar from './components/NavBar';

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

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [tagFilter, setTagFilter] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('createdAt');

  useEffect(() => {
    const stored = localStorage.getItem('tasks');
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch {
        setTasks([]);
      }
    }
  }, []);

  const deleteTask = (id: string) => {
    const updated = tasks.filter(task => task.id !== id);
    setTasks(updated);
    localStorage.setItem('tasks', JSON.stringify(updated));
  };

  const filteredTasks = tasks
    .filter(task => statusFilter === 'All' || task.status === statusFilter)
    .filter(task => priorityFilter === 'All' || task.priority === priorityFilter)
    .filter(task =>
      tagFilter.trim() === '' ||
      task.tags.some(tag => tag.toLowerCase() === tagFilter.trim().toLowerCase())
    )
    .filter(task => task.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === 'priority') {
        const order: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
        return order[a.priority] - order[b.priority];
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const badgeColor = (status: string) => {
    switch (status) {
      case 'Todo': return 'bg-gray-800 text-gray-300 border border-gray-600';
      case 'In Progress': return 'bg-gray-700 text-gray-100 border border-gray-500';
      case 'Done': return 'bg-gray-600 text-white border border-gray-400';
      default: return '';
    }
  };

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-400 font-bold';
      case 'Medium': return 'text-gray-300 font-semibold';
      case 'Low': return 'text-gray-400 font-medium';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <NavBar />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-extrabold mb-6 tracking-tight">Your Tasks</h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <Link href="/create">
            <button className="bg-gray-700 text-white px-5 py-2 rounded-xl hover:scale-105 transition-transform shadow-md hover:bg-gray-600">
              + Create Task
            </button>
          </Link>
          <input
            type="text"
            placeholder=" Search title..."
            className="p-2 px-4 rounded-xl bg-gray-800 text-white border border-gray-600 focus:outline-none w-full sm:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 rounded-xl text-white bg-gray-800 border border-gray-600">
            <option value="All">All Statuses</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="p-2 rounded-xl text-white bg-gray-800 border border-gray-600">
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <input
            type="text"
            placeholder="Tag filter"
            className="p-2 rounded-xl text-white bg-gray-800 border border-gray-600"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            autoComplete="off"
          />

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2 rounded-xl text-white bg-gray-800 border border-gray-600">
            <option value="createdAt">Newest First</option>
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>

        {filteredTasks.length === 0 ? (
          <p className="text-gray-400">No tasks match your filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div key={task.id} className="p-5 rounded-2xl bg-gray-900 border border-gray-700 shadow hover:shadow-lg transition">
                <h2 className="text-2xl font-semibold mb-1">{task.title}</h2>
                <p className="text-sm text-gray-400 mb-3">{task.description}</p>

                <div className="flex flex-wrap gap-2 text-sm mb-2 items-center">
                  <span className={`${priorityColor(task.priority)}`}>⚡ {task.priority}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${badgeColor(task.status)}`}>📌 {task.status}</span>
                  <span className="text-gray-400 text-sm">📅 {task.dueDate}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {task.tags.length > 0 ? (
                    task.tags.map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full border border-gray-600">
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500 italic">No tags</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link href={`/create?id=${task.id}`}>
                    <button className="bg-gray-300 text-black px-3 py-1 text-sm rounded-xl hover:scale-105 transition">Edit</button>
                  </Link>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-700 text-white px-3 py-1 text-sm rounded-xl hover:bg-red-600 hover:scale-105 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
