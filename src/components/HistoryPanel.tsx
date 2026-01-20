'use client';

import { useState, useEffect } from 'react';
import { History, Trash2, Clock, X } from 'lucide-react';

interface HistoryRecord {
  id: string;
  type: 'simple' | 'compound' | 'irr';
  title: string;
  result: string;
  timestamp: number;
  details?: string;
}

export default function HistoryPanel() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  // 从 localStorage 加载历史记录
  useEffect(() => {
    const saved = localStorage.getItem('calculatorHistory');
    if (saved) {
      try {
        const parsedHistory = JSON.parse(saved);
        // 确保每条记录都有 id 字段，如果没有则添加
        const historyWithIds = parsedHistory.map((record: HistoryRecord, index: number) => ({
          ...record,
          id: record.id || `old-record-${index}-${Date.now()}`
        }));
        setHistory(historyWithIds);
      } catch (error) {
        console.error('加载历史记录失败:', error);
      }
    }
  }, []);

  // 保存历史记录到 localStorage
  const saveHistory = (newHistory: HistoryRecord[]) => {
    setHistory(newHistory);
    localStorage.setItem('calculatorHistory', JSON.stringify(newHistory));
  };

  // 删除单条记录
  const deleteRecord = (id: string) => {
    const newHistory = history.filter(record => record.id !== id);
    saveHistory(newHistory);
  };

  // 清空所有历史记录
  const clearHistory = () => {
    if (confirm('确定要清空所有历史记录吗？')) {
      saveHistory([]);
    }
  };

  // 格式化时间
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    
    return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // 获取类型标签颜色
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'simple':
        return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
      case 'compound':
        return 'bg-green-600/20 text-green-400 border-green-600/30';
      case 'irr':
        return 'bg-purple-600/20 text-purple-400 border-purple-600/30';
      default:
        return 'bg-slate-600/20 text-slate-400 border-slate-600/30';
    }
  };

  // 获取类型名称
  const getTypeName = (type: string) => {
    switch (type) {
      case 'simple':
        return '简单计算';
      case 'compound':
        return '复利年金';
      case 'irr':
        return 'IRR分析';
      default:
        return '未知';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900/30">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">历史记录</h2>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
        </button>
      </div>

      {/* Content */}
      {isOpen && (
        <>
          {history.length === 0 ? (
            <div className="p-8 text-center">
              <History className="h-12 w-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">暂无历史记录</p>
              <p className="text-slate-500 text-xs mt-1">开始计算后记录将自动保存</p>
            </div>
          ) : (
            <>
              {/* History List */}
              <div className="max-h-[400px] overflow-y-auto">
                {history.map((record) => (
                  <div
                    key={record.id}
                    className="p-4 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getTypeColor(record.type)}`}>
                          {getTypeName(record.type)}
                        </span>
                        <h3 className="text-sm font-medium text-white truncate">
                          {record.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => deleteRecord(record.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
                        title="删除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="text-lg font-bold text-green-400 mb-2">
                      {record.result}
                    </p>

                    {record.details && (
                      <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                        {record.details}
                      </p>
                    )}

                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(record.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-700 bg-slate-900/30">
                <button
                  onClick={clearHistory}
                  className="w-full py-2 px-4 bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  清空所有记录
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

// 导出添加历史记录的函数，供其他组件调用
export function addHistoryRecord(record: Omit<HistoryRecord, 'id' | 'timestamp'>) {
  const newRecord: HistoryRecord = {
    ...record,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    timestamp: Date.now(),
  };

  const saved = localStorage.getItem('calculatorHistory');
  const history = saved ? JSON.parse(saved) : [];
  
  // 只保留最近 50 条记录
  const newHistory = [newRecord, ...history].slice(0, 50);
  
  localStorage.setItem('calculatorHistory', JSON.stringify(newHistory));
}
