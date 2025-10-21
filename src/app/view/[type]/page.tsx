import { ViewPageClient } from './ViewPageClient';

interface ViewPageProps {
  params: {
    type: string;
  };
}

// 为静态导出提供静态参数
export async function generateStaticParams() {
  return [
    { type: 'all' },
    { type: 'today' },
    { type: 'important' },
    { type: 'completed' },
    { type: 'category-work' },
    { type: 'category-personal' },
    { type: 'category-shopping' },
  ];
}

export default function ViewPage({ params }: ViewPageProps) {
  return <ViewPageClient params={params} />;
}
