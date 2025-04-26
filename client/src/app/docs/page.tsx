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

export default function DocsPage() {
      const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

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
  }
  