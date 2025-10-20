import { TaskListPage } from '@/components/pages/TaskListPage';

interface CategoryPageProps {
  params: {
    id: string;
  };
}

// 为静态导出提供静态参数
// 返回一些示例参数以满足静态导出要求
export async function generateStaticParams() {
  return [{ id: 'work' }, { id: 'personal' }, { id: 'shopping' }];
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return <TaskListPage viewType="category" categoryId={params.id} />;
}
