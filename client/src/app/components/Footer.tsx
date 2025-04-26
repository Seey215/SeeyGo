// components/Navbar.tsx
'use client';
import React from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
export default function Footer() {
  return (
    <div className="bg-white border-r flex flex-col">
      <footer className="h-10 bg-gray-100 border-t flex items-center justify-center text-gray-600 text-sm">
        © {new Date().getFullYear()} SeeyGo - 高效工作平台
      </footer>
    </div>
  );
}
