// components/Sidebar.tsx
'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { name: "首页", path: "/" },
  { name: "待办事项", path: "/todo" },
  { name: "文档系统", path: "/docs" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-56 bg-white border-r flex flex-col pt-20">
      <div className="p-4 border-b">
        <h1 className="text-lg font-medium">导航菜单</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {navItems.map(item => (
          <Link
            key={item.path}
            href={item.path}
            className={clsx(
              "flex items-center w-full p-3 rounded-button",
              pathname === item.path ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
