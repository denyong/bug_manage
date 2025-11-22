import React, { useState, useEffect } from 'react';
import { LayoutDashboard, List, Plus, Bug } from 'lucide-react';
import { Defect, ViewState, DefectStatus, DefectPriority } from './types';
import { Dashboard } from './components/Dashboard';
import { DefectList } from './components/DefectList';
import { DefectDetail } from './components/DefectDetail';
import { NewDefectModal } from './components/NewDefectModal';

// Initial Mock Data
const INITIAL_DEFECTS: Defect[] = [
  {
    id: 'DEF-1001',
    title: '用户资料上传导致应用崩溃',
    description: '当用户尝试上传大于5MB的PNG图像到个人资料时，应用程序崩溃并出现500错误。预期的行为是显示验证消息，告诉用户文件太大。',
    status: DefectStatus.OPEN,
    priority: DefectPriority.CRITICAL,
    assignee: '张伟',
    reporter: '李娜',
    createdAt: '2023-10-25T10:00:00Z',
    updatedAt: '2023-10-25T10:30:00Z',
    comments: [
      { id: 'c1', author: '李娜', content: '日志显示图像处理服务中出现了内存溢出异常。', createdAt: '2023-10-25T10:05:00Z'}
    ],
    tags: ['后端', '上传', 'bug']
  },
  {
    id: 'DEF-1002',
    title: '暗黑模式切换状态不准确',
    description: '切换开关显示“开启”，但主题实际上是浅色的，刷新页面后反之亦然。LocalStorage似乎与React状态不同步。',
    status: DefectStatus.IN_PROGRESS,
    priority: DefectPriority.LOW,
    assignee: '王强',
    reporter: '赵敏',
    createdAt: '2023-10-24T14:15:00Z',
    updatedAt: '2023-10-26T09:00:00Z',
    comments: [],
    tags: ['前端', 'UI', 'UX']
  },
  {
    id: 'DEF-1003',
    title: '搜索端点缺少API速率限制',
    description: '安全审计显示 /api/v1/search 端点可能会被大量请求淹没。我们需要对每个IP实施速率限制（100次请求/分钟）。',
    status: DefectStatus.OPEN,
    priority: DefectPriority.HIGH,
    assignee: '未分配',
    reporter: '安全运维团队',
    createdAt: '2023-10-20T08:00:00Z',
    updatedAt: '2023-10-20T08:00:00Z',
    comments: [],
    tags: ['安全', '后端', 'API']
  },
   {
    id: 'DEF-1004',
    title: '着陆页英雄区域拼写错误',
    description: '主横幅上的单词“Efficiency”拼写为“Effifiency”。',
    status: DefectStatus.RESOLVED,
    priority: DefectPriority.LOW,
    assignee: '张伟',
    reporter: '市场部',
    createdAt: '2023-10-22T09:30:00Z',
    updatedAt: '2023-10-23T11:00:00Z',
    comments: [{id: 'c2', author: '张伟', content: '已在提交 a4f5b2 中修复。', createdAt: '2023-10-23T11:00:00Z'}],
    tags: ['前端', '内容']
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [defects, setDefects] = useState<Defect[]>(INITIAL_DEFECTS);
  const [selectedDefectId, setSelectedDefectId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedDefect = defects.find(d => d.id === selectedDefectId);

  const handleCreateDefect = (newDefect: Defect) => {
    setDefects([newDefect, ...defects]);
    setView('list');
  };

  const handleUpdateDefect = (updated: Defect) => {
    setDefects(defects.map(d => d.id === updated.id ? updated : d));
  };

  const handleSelectDefect = (defect: Defect) => {
    setSelectedDefectId(defect.id);
    setView('detail');
  };

  // Main Layout
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 transition-all">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Bug size={20} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">BugBuster AI</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              view === 'dashboard' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">仪表盘</span>
          </button>

          <button
            onClick={() => setView('list')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              view === 'list' || view === 'detail'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <List size={20} />
            <span className="font-medium">缺陷列表</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-lg shadow-md transition-all transform active:scale-95"
          >
            <Plus size={20} />
            <span className="font-semibold">新建缺陷</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {view === 'dashboard' && <Dashboard defects={defects} />}
        
        {view === 'list' && (
          <DefectList 
            defects={defects} 
            onSelectDefect={handleSelectDefect} 
          />
        )}

        {view === 'detail' && selectedDefect && (
          <DefectDetail 
            defect={selectedDefect} 
            onBack={() => setView('list')}
            onUpdateDefect={handleUpdateDefect}
          />
        )}
      </main>

      {/* Modals */}
      <NewDefectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateDefect} 
      />
    </div>
  );
};

export default App;