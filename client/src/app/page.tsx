'use client';
import React, { useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import {
  BookOutlined,
  CheckSquareOutlined,
  HomeOutlined,
  NotificationOutlined,
  QuestionCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Card, Input, Select, Space, Table, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';

const swiperModules = [Pagination, Autoplay];

const App: React.FC = () => {
  const [searchEngine, setSearchEngine] = useState('Google');
  const [activeMenu, setActiveMenu] = useState('home');
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 文档树数据
  const docTreeData: DataNode[] = [
    {
      title: '技术文档',
      key: '0-0',
      children: [
        {
          title: '前端开发',
          key: '0-0-0',
          children: [
            { title: 'React 入门指南', key: '0-0-0-0' },
            { title: 'TypeScript 最佳实践', key: '0-0-0-1' },
          ],
        },
        {
          title: '后端开发',
          key: '0-0-1',
          children: [
            { title: 'Node.js 性能优化', key: '0-0-1-0' },
            { title: '数据库设计规范', key: '0-0-1-1' },
          ],
        },
      ],
    },
    {
      title: '产品文档',
      key: '0-1',
      children: [
        { title: '产品需求文档', key: '0-1-0' },
        { title: '用户手册', key: '0-1-1' },
      ],
    },
  ];

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

  // 网址导航数据
  const bookmarkData = [
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com' },
    { name: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
    { name: '掘金', url: 'https://juejin.cn' },
    { name: '知乎', url: 'https://www.zhihu.com' },
    { name: 'V2EX', url: 'https://www.v2ex.com' },
    { name: 'CSDN', url: 'https://www.csdn.net' },
    { name: 'SegmentFault', url: 'https://segmentfault.com' },
    { name: 'LeetCode', url: 'https://leetcode.cn' },
  ];

  // 最近文档数据
  const recentDocs = [
    { title: 'React 入门指南', lastOpen: '2023-12-08' },
    { title: 'Node.js 性能优化', lastOpen: '2023-12-05' },
    { title: '产品需求文档', lastOpen: '2023-12-01' },
  ];

  // 公告数据
  const announcements = [
    '系统将于本周五凌晨 2:00-3:00 进行维护升级',
    '新增 Markdown 编辑器功能，欢迎体验',
    'Todo 列表新增优先级筛选功能',
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'home':
        return (
          <div className="flex flex-1 gap-6">
            {/* 主内容区 */}
            <div className="flex-1">
              {/* Todo 卡片 */}
              <Card
                title="待办事项"
                className="mb-6"
              >
                <Table
                  dataSource={todoData}
                  columns={[
                    { title: '任务', dataIndex: 'task', key: 'task' },
                    { title: '优先级', dataIndex: 'priority', key: 'priority' },
                    { title: '状态', dataIndex: 'status', key: 'status' },
                    { title: '截止日期', dataIndex: 'deadline', key: 'deadline' },
                  ]}
                  pagination={false}
                />
              </Card>

              {/* 最近文档 */}
              <Card title="最近文档">
                <div className="space-y-4">
                  {recentDocs.map(doc => (
                    <div
                      key={doc.title}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setActiveMenu('doc');
                        setSelectedDoc(doc.title);
                      }}
                    >
                      <span>{doc.title}</span>
                      <span className="text-gray-500 text-sm">{doc.lastOpen}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* 辅助内容区 */}
            <div className="w-80">
              {/* 网址导航 */}
              <Card
                title="常用网址"
                className="mb-6"
              >
                <div className="grid grid-cols-3 gap-3">
                  {bookmarkData.map(bookmark => (
                    <a
                      key={bookmark.name}
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center h-20 bg-gray-50 hover:bg-gray-100 rounded-button p-2 text-center"
                    >
                      {bookmark.name}
                    </a>
                  ))}
                </div>
              </Card>

              {/* 公告 */}
              <Card title="系统公告">
                <Swiper
                  modules={swiperModules}
                  spaceBetween={16}
                  slidesPerView={1}
                  direction="vertical"
                  autoplay={{ delay: 5000 }}
                  pagination={{ clickable: true }}
                  className="h-48"
                >
                  {announcements.map((announcement, index) => (
                    <SwiperSlide key={index}>
                      <div className="h-full flex items-center p-4 bg-gray-50 rounded-button">{announcement}</div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Card>
            </div>
          </div>
        );
      case 'todo':
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
      case 'doc':
        return (
          <div className="flex-1 flex">
            {/* 文档目录 */}
            <div className="w-64 p-4 border-r">
              {/* <Tree
                treeData={docTreeData}
                onSelect={(selectedKeys, { node }) => {
                  if (!node.children) {
                    setSelectedDoc(node.title as string);
                  }
                }}
                defaultExpandAll
              /> */}
              <Tree
                treeData={docTreeData}
                onSelect={(selectedKeys, { node }) => {
                  if (!node.children) {
                    setSelectedDoc(node.title as string);
                  }
                }}
                selectedKeys={selectedDoc ? [selectedDoc] : []}
                defaultExpandAll
              />
            </div>
            {/* 文档内容 */}
            <div className="flex-1 p-6">
              {selectedDoc ? (
                <Card title={selectedDoc}>
                  <div className="prose max-w-none">
                    <h1>{selectedDoc}</h1>
                    <p>这里是文档内容，支持 Markdown 格式。</p>
                    <p>您可以在这里编写详细的技术文档。</p>
                    <pre>
                      <code>console.log('Hello World');</code>
                    </pre>
                  </div>
                </Card>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">请从左侧选择文档</div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 主体内容 */}
      <div className="flex flex-1 pt-10">
        {/* 内容区 */}
        <main className="flex-1 bg-gray-50">
          {activeMenu === 'home' && (
            <div className="p-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-button mb-6">
                <h1 className="text-2xl font-bold">Hi，欢迎来到 SeeyGo</h1>
                <p className="mt-2">高效工作，从这里开始</p>
              </div>
              {renderContent()}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
