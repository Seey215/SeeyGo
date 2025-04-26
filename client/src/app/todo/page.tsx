'use client';
import React from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Button, Card, Space, Table } from 'antd';

export default function TodoPage() {

    // Todo 数据
    const todoData = [
      {
        key: '1',
        task: '完成项目原型设计',
        priority: '高',
        status: '进行中',
        deadline: '2023-12-15',
      },
      {
        key: '2',
        task: '编写技术文档',
        priority: '中',
        status: '待开始',
        deadline: '2023-12-20',
      },
      {
        key: '3',
        task: '代码评审',
        priority: '低',
        status: '已完成',
        deadline: '2023-12-10',
      },
    ];

  return (
    <div className="flex-1 p-6">
      <Card title="待办事项管理">
        <div className="mb-6">
          <Space>
            <Button type="primary">添加任务</Button>
            <Button>回收站</Button>
          </Space>
        </div>
        <Table
          dataSource={todoData}
          columns={[
            { title: '任务', dataIndex: 'task', key: 'task' },
            { title: '优先级', dataIndex: 'priority', key: 'priority' },
            { title: '状态', dataIndex: 'status', key: 'status' },
            { title: '截止日期', dataIndex: 'deadline', key: 'deadline' },
            {
              title: '操作',
              key: 'action',
              render: () => (
                <Space size="middle">
                  <a>编辑</a>
                  <a>删除</a>
                </Space>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
  }
  