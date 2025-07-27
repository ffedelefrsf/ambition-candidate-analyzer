import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useEffect, useState } from 'react';

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const current = stored === 'dark' ? 'dark' : 'light';
    setTheme(current);
    document.documentElement.classList.toggle('dark', current === 'dark');
  }, []);

  // Toggle theme + update <html>
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <>
      <header className="mb-2 flex justify-between bg-gray-100 px-4 shadow-md dark:bg-gray-800">
        <nav className="flex flex-1 items-center gap-4 text-sm font-medium">
          <Link
            to="/"
            className="[&.active]:text-primary-light hover:text-primary text-xl font-black hover:underline dark:text-white"
          >
            <img src="/ambition-favicon-32x32.png" height={32} width={32} />
          </Link>
          <Link
            to="/careers"
            className="[&.active]:text-primary-light hover:text-primary text-xl font-black hover:underline dark:text-white"
          >
            Careers
          </Link>
          <Link
            to="/candidates"
            className="[&.active]:text-primary-light hover:text-primary text-xl font-black hover:underline dark:text-white"
          >
            Candidates
          </Link>
        </nav>
        <div className="mx-auto flex max-w-7xl justify-end p-4">
          <button
            onClick={toggleTheme}
            className="text-2xl transition hover:scale-110"
            title="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
