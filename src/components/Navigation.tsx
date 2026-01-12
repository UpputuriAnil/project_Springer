'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, Users, Settings, User, LogOut } from 'lucide-react';

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: <Home className="h-5 w-5" /> },
  { name: 'Analytics', href: '/analytics', icon: <BarChart2 className="h-5 w-5" /> },
  { name: 'Team', href: '/team', icon: <Users className="h-5 w-5" /> },
  { name: 'Profile', href: '/profile', icon: <User className="h-5 w-5" /> },
  { name: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5" /> },
];

export default function Navigation() {
  const pathname = usePathname();
  
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-white text-xl font-bold">Sales Dashboard</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <div className="mr-3">
                      {React.cloneElement(item.icon as React.ReactElement, {
                        className: `h-6 w-6 ${
                          isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                        }`,
                      })}
                    </div>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex bg-gray-700 p-4">
            <div className="flex-shrink-0 group block">
              <div className="flex items-center">
                <div>
                  <div className="h-9 w-9 rounded-full bg-gray-600 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">John Doe</p>
                  <Link
                    href="/profile"
                    className="text-xs font-medium text-gray-300 hover:text-white"
                  >
                    View profile
                  </Link>
                </div>
              </div>
            </div>
            <div className="ml-auto">
              <button className="flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
