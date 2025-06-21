'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/create', label: 'Create Task' },
  ];

  return (
    <nav className="bg-gray-950 border-b border-gray-800 mb-8">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="text-2xl font-bold text-blue-400 tracking-wide">Tasker</span>
        <div className="flex gap-4">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href}>
              <span
                className={`px-4 py-2 rounded-xl transition 
                ${pathname.startsWith(link.href)
                  ? 'bg-blue-700 text-white font-semibold shadow'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'}
                `}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}