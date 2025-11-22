import React, { useState } from 'react';
import { Defect, DefectStatus, DefectPriority } from '../types';
import { StatusBadge } from './StatusBadge';
import { Search, Filter, ChevronRight } from 'lucide-react';

interface DefectListProps {
  defects: Defect[];
  onSelectDefect: (defect: Defect) => void;
}

export const DefectList: React.FC<DefectListProps> = ({ defects, onSelectDefect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredDefects = defects.filter(defect => {
    const matchesSearch = defect.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          defect.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || defect.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">缺陷列表</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="搜索缺陷..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white w-full"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">所有状态</option>
              {Object.values(DefectStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">标题</th>
                <th className="px-6 py-4">状态</th>
                <th className="px-6 py-4">优先级</th>
                <th className="px-6 py-4">负责人</th>
                <th className="px-6 py-4">创建时间</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDefects.map((defect) => (
                <tr 
                  key={defect.id} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onSelectDefect(defect)}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">{defect.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{defect.title}</div>
                    <div className="text-xs text-gray-400 truncate max-w-[200px]">{defect.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={defect.status} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge priority={defect.priority} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                        {defect.assignee.charAt(0)}
                      </div>
                      {defect.assignee}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(defect.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ChevronRight size={16} className="text-gray-400" />
                  </td>
                </tr>
              ))}
              {filteredDefects.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    未找到符合条件的缺陷。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};