'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  UserGroupIcon, 
  GlobeAltIcon, 
  BuildingOfficeIcon, 
  MagnifyingGlassCircleIcon,
  SwatchIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

const navItems = [
  {
    name: 'Crawls',
    href: '/admin/crawls',
    icon: GlobeAltIcon,
  },
  {
    name: 'Customers',
    href: '/admin/customers',
    icon: UserGroupIcon,
  },
  {
    name: 'Organisation',
    href: '/admin/organisation',
    icon: BuildingOfficeIcon,
  },
  {
    name: 'Scans',
    href: '/admin/scans',
    icon: MagnifyingGlassCircleIcon,
  },
  {
    name: 'Brand Config',
    href: '/admin/brand-configuration',
    icon: SwatchIcon,
  },
  {
    name: 'ChatGPT Schema',
    href: '/admin/chatgpt',
    icon: CodeBracketIcon,
  },
];

export default function AdminSubNav() {
  const pathname = usePathname();

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-8">
        <nav className="flex space-x-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}