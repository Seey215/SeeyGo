import { TaskListPage } from '@/components/pages/TaskListPage';

interface CategoryPageProps {
  params: {
    id: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return <TaskListPage viewType="category" categoryId={params.id} />;
}
