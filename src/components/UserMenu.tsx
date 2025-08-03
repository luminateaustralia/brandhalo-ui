'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UserIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';

interface UserMenuProps {
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
}

export default function UserMenu({ user }: UserMenuProps) {
  const handleSignOut = () => {
    signOut({ redirectTo: '/login' });
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors">
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <UserIcon className="w-5 h-5 text-gray-600" />
        </div>
        <span className="text-sm font-medium">
          {user?.name || user?.email || 'User'}
        </span>
      </Menu.Button>
      
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-gray-900">
              {user?.name || 'User'}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {user?.email || ''}
            </p>
          </div>
          
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleSignOut}
                  className={`${
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  } flex w-full items-center px-4 py-2 text-sm`}
                >
                  Sign out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
} 