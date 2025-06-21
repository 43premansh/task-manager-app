
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const NAVBAR = (
  <nav className="flex justify-between items-center py-4 px-6 bg-[#1e1e1e] text-white shadow-md mb-8">
    <h1 className="text-xl font-bold">Task Manager</h1>
    <div className="space-x-4">
      <Link href="/create" className="bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition">Create Task</Link>
    </div>
  </nav>
);


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
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [tagFilter, setTagFilter] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => {
    const stored = localStorage.getItem('tasks');
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  const deleteTask = (id: string) => {
    const updated = tasks.filter(task => task.id !== id);
    setTasks(updated);
    localStorage.setItem('tasks', JSON.stringify(updated));
  };

  const filteredTasks = tasks
    .filter(task => statusFilter === 'All' || task.status === statusFilter)
    .filter(task => priorityFilter === 'All' || task.priority === priorityFilter)
    .filter(task => tagFilter.trim() === '' || task.tags.includes(tagFilter.trim()))
    .filter(task => task.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'dueDate') return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      if (sortBy === 'priority') {
        const order = { High: 0, Medium: 1, Low: 2 };
        return order[a.priority] - order[b.priority];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const badgeColor = (status: string) => {
    const map = {
      'Todo': 'bg-gray-800 text-gray-300',
      'In Progress': 'bg-gray-700 text-gray-100',
      'Done': 'bg-gray-600 text-white',
    };
    return `${map[status]} border border-gray-500`;
  };

  const priorityColor = (priority: string) => {
    return {
      High: 'text-red-400 font-bold',
      Medium: 'text-gray-300 font-semibold',
      Low: 'text-gray-400 font-medium',
    }[priority];
  };

  const countByStatus = (status: string) =>
    tasks.filter(t => t.status === status).length;

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {NAVBAR}

      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {['Todo', 'In Progress', 'Done'].map((s) => (
            <div key={s} className="bg-gray-800 p-4 rounded-xl shadow-md flex justify-between">
              <span>{s}</span>
              <span className="font-bold text-lg">{countByStatus(s)}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 rounded-xl bg-gray-800 border border-gray-600">
            <option value="All">All Statuses</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="p-2 rounded-xl bg-gray-800 border border-gray-600">
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input type="text" placeholder="Tag filter" value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} className="p-2 rounded-xl bg-gray-800 border border-gray-600" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2 rounded-xl bg-gray-800 border border-gray-600">
            <option value="createdAt">Newest First</option>
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>

        <div className="mb-6">
          <input type="text" placeholder="Search by title..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full p-2 rounded-xl bg-gray-800 border border-gray-600" />
        </div>

        {filteredTasks.length === 0 ? (
          <p className="text-gray-400">No tasks match your filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div key={task.id} className="p-5 rounded-2xl bg-gray-900 border border-gray-700 shadow">
                <h2 className="text-2xl font-semibold mb-1">{task.title}</h2>
                <p className="text-sm text-gray-400 mb-3">{task.description}</p>
                <div className="flex flex-wrap gap-2 text-sm mb-2">
                  <span className={priorityColor(task.priority)}>⚡ {task.priority}</span>
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
                  <Link href={`/create?id=${task.id}`} className="bg-gray-300 text-black px-3 py-1 text-sm rounded-xl hover:scale-105 transition">Edit</Link>
                  <button onClick={() => deleteTask(task.id)} className="bg-red-700 text-white px-3 py-1 text-sm rounded-xl hover:bg-red-600 hover:scale-105 transition">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
