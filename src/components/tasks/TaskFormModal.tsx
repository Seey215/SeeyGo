'use client';

import React from 'react';
import { Modal } from '@/components/ui';
import { TaskForm } from './TaskForm';
import { useTasks } from '@/hooks/useTasks';
import type { Task, TaskFormData } from '@/types';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
}

export function TaskFormModal({ isOpen, onClose, task }: TaskFormModalProps) {
  const { createTask, updateTask } = useTasks();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (data: TaskFormData) => {
    setLoading(true);
    try {
      if (task) {
        await updateTask(task.id, data);
      } else {
        await createTask(data);
      }
      onClose();
    } catch (error) {
      console.error('保存任务失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={task ? '编辑任务' : '创建新任务'}
      size="lg"
    >
      <TaskForm
        task={task}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </Modal>
  );
}