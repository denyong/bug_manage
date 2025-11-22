import React, { useState } from 'react';
import { Defect, DefectStatus, DefectPriority, Comment } from '../types';
import { StatusBadge } from './StatusBadge';
import { analyzeDefectWithAI } from '../services/geminiService';
import { ArrowLeft, Sparkles, Send, Clock, User, Calendar, Tag, Save } from 'lucide-react';

interface DefectDetailProps {
  defect: Defect;
  onBack: () => void;
  onUpdateDefect: (updatedDefect: Defect) => void;
}

export const DefectDetail: React.FC<DefectDetailProps> = ({ defect, onBack, onUpdateDefect }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeDefectWithAI(defect);
      onUpdateDefect({ ...defect, aiAnalysis: analysis });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateDefect({ ...defect, status: e.target.value as DefectStatus });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      author: '当前用户', // Mock user
      content: newComment,
      createdAt: new Date().toISOString(),
    };
    onUpdateDefect({
      ...defect,
      comments: [...defect.comments, comment]
    });
    setNewComment('');
  };

  return (
    <div className="h-full overflow-y-auto bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-sm font-mono text-gray-500">{defect.id}</span>
              <StatusBadge status={defect.status} />
              <StatusBadge priority={defect.priority} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 line-clamp-1">{defect.title}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={defect.status}
            onChange={handleStatusChange}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            {Object.values(DefectStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all ${
              isAnalyzing 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
            }`}
          >
            <Sparkles size={18} className={isAnalyzing ? 'animate-spin' : ''} />
            {isAnalyzing ? '分析中...' : 'AI 分析'}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">描述</h3>
            <div className="prose prose-slate max-w-none text-gray-600 whitespace-pre-wrap">
              {defect.description}
            </div>
          </section>

           {/* AI Analysis Section */}
           {(defect.aiAnalysis || isAnalyzing) && (
            <section className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
              <div className="flex items-center gap-2 mb-4 text-indigo-800">
                <Sparkles size={20} />
                <h3 className="font-bold text-lg">Gemini AI 见解</h3>
              </div>
              {isAnalyzing ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
                  <div className="h-4 bg-indigo-200 rounded w-full"></div>
                  <div className="h-4 bg-indigo-200 rounded w-5/6"></div>
                </div>
              ) : (
                <div className="prose prose-indigo text-sm max-w-none text-indigo-900 whitespace-pre-wrap">
                  {defect.aiAnalysis}
                </div>
              )}
            </section>
          )}

          {/* Comments */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              评论 <span className="bg-gray-200 text-gray-600 px-2 rounded-full text-sm">{defect.comments.length}</span>
            </h3>
            
            <div className="space-y-6 mb-6">
              {defect.comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center font-bold text-gray-500 text-xs">
                    {comment.author.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-sm text-gray-900">{comment.author}</span>
                        <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 items-start">
               <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center font-bold text-blue-600 text-xs">
                我
              </div>
              <div className="flex-1 relative">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="写下评论..."
                  className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button 
                  onClick={handleAddComment}
                  className="absolute bottom-3 right-3 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-4">
            <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">详细信息</h4>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-gray-500 text-sm flex items-center gap-2"><User size={14}/> 负责人</span>
              <span className="font-medium text-gray-800 text-sm">{defect.assignee}</span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-gray-500 text-sm flex items-center gap-2"><User size={14}/> 报告人</span>
              <span className="font-medium text-gray-800 text-sm">{defect.reporter}</span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-gray-500 text-sm flex items-center gap-2"><Calendar size={14}/> 创建时间</span>
              <span className="font-medium text-gray-800 text-sm">{new Date(defect.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-500 text-sm flex items-center gap-2"><Clock size={14}/> 最后更新</span>
              <span className="font-medium text-gray-800 text-sm">{new Date(defect.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
             <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Tag size={14} /> 标签
             </h4>
             <div className="flex flex-wrap gap-2">
                {defect.tags.map((tag, i) => (
                  <span key={i} className="bg-white border border-gray-300 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                    {tag}
                  </span>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};