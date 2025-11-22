import React, { useMemo } from 'react';
import { Defect, DefectStatus, DefectPriority } from '../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { AlertCircle, CheckCircle, Clock, Activity } from 'lucide-react';

interface DashboardProps {
  defects: Defect[];
}

const COLORS = ['#3b82f6', '#eab308', '#22c55e', '#64748b']; // Blue, Yellow, Green, Slate

export const Dashboard: React.FC<DashboardProps> = ({ defects }) => {
  
  const stats = useMemo(() => {
    return {
      total: defects.length,
      open: defects.filter(d => d.status === DefectStatus.OPEN).length,
      inProgress: defects.filter(d => d.status === DefectStatus.IN_PROGRESS).length,
      resolved: defects.filter(d => d.status === DefectStatus.RESOLVED).length,
      critical: defects.filter(d => d.priority === DefectPriority.CRITICAL).length,
    };
  }, [defects]);

  const statusData = [
    { name: '待处理', value: stats.open },
    { name: '处理中', value: stats.inProgress },
    { name: '已解决', value: stats.resolved },
    { name: '已关闭', value: defects.filter(d => d.status === DefectStatus.CLOSED).length },
  ];

  // Prepare data for Priority bar chart
  const priorityData = [
    { name: '低', count: defects.filter(d => d.priority === DefectPriority.LOW).length },
    { name: '中', count: defects.filter(d => d.priority === DefectPriority.MEDIUM).length },
    { name: '高', count: defects.filter(d => d.priority === DefectPriority.HIGH).length },
    { name: '严重', count: defects.filter(d => d.priority === DefectPriority.CRITICAL).length },
  ];

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800">仪表盘总览</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">缺陷总数</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-red-50 text-red-600 mr-4">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">严重问题</p>
            <p className="text-2xl font-bold text-gray-900">{stats.critical}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-yellow-50 text-yellow-600 mr-4">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">处理中</p>
            <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-green-50 text-green-600 mr-4">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">已解决</p>
            <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">状态分布</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">优先级分布</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{fill: '#f1f5f9'}} />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};