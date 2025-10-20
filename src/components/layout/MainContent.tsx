'use client';

import type { ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
}

/**
 * 主内容区域组件
 */
export function MainContent({ children }: MainContentProps) {
  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto bg-slate-25">
        <div className="h-full">{children}</div>
      </div>
    </main>
  );
}
