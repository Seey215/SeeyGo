// components/Navbar.tsx
'use client';
import React, { useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { NotificationOutlined, QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Input, Select } from 'antd';
export default function Navbar() {
  const [searchEngine, setSearchEngine] = useState('Google');

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="w-56 bg-white border-r flex flex-col">
      <div className="h-16 bg-blue-600 text-white flex items-center px-6 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center mr-8">
          {isLoggedIn ? (
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600">
              <UserOutlined className="text-xl" />
            </div>
          ) : (
            <div className="text-xl font-bold">SeeyGo</div>
          )}
        </div>

        <div className="flex-1 max-w-2xl">
          <Input
            placeholder="搜索..."
            className="!rounded-button"
            addonBefore={
              <Select
                value={searchEngine}
                onChange={setSearchEngine}
                // bordered={false}
                variant="borderless"
                className="w-24"
              >
                <Select.Option value="Google">Google</Select.Option>
                <Select.Option value="Bing">Bing</Select.Option>
              </Select>
            }
            suffix={
              <button className="text-gray-500 hover:text-blue-500">
                <i className="fas fa-search" />
              </button>
            }
          />
        </div>

        <div className="ml-8 flex items-center space-x-6">
          <button className="text-xl">
            <QuestionCircleOutlined />
          </button>
          <button className="text-xl">
            <NotificationOutlined />
          </button>
          <Button
            type="text"
            className="!text-white"
            onClick={() => setIsLoggedIn(!isLoggedIn)}
          >
            {isLoggedIn ? '退出登录' : '登录'}
          </Button>
        </div>
      </div>
    </div>
  );
}
