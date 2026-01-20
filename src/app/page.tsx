'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, TrendingUp, PieChart } from 'lucide-react';
import SimpleCalculator from '@/components/SimpleCalculator';
import CompoundCalculator from '@/components/CompoundCalculator';
import IRRCalculator from '@/components/IRRCalculator';
import HistoryPanel from '@/components/HistoryPanel';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">理财规划计算工具</h1>
              <p className="text-slate-400 mt-1">专业理财计算与规划助手</p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Calculator className="h-4 w-4" />
                <span>简单计算 · 复利年金 · IRR分析</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* 左侧：计算器区域 */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="simple" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
                <TabsTrigger 
                  value="simple" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  简单计算器
                </TabsTrigger>
                <TabsTrigger 
                  value="compound" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  复利年金
                </TabsTrigger>
                <TabsTrigger 
                  value="irr" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <PieChart className="h-4 w-4 mr-2" />
                  IRR分析
                </TabsTrigger>
              </TabsList>

              <TabsContent value="simple" className="mt-6">
                <SimpleCalculator />
              </TabsContent>

              <TabsContent value="compound" className="mt-6">
                <CompoundCalculator />
              </TabsContent>

              <TabsContent value="irr" className="mt-6">
                <IRRCalculator />
              </TabsContent>
            </Tabs>
          </div>

          {/* 右侧：历史记录 */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <HistoryPanel />
              
              {/* 使用说明 */}
              <div className="mt-6 bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">使用说明</h3>
                <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-400 font-bold text-xs">1</span>
                    </div>
                    <p>选择需要的计算器类型</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-400 font-bold text-xs">2</span>
                    </div>
                    <p>输入相关参数，系统自动计算</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-400 font-bold text-xs">3</span>
                    </div>
                    <p>查看图表分析，理解增长趋势</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-400 font-bold text-xs">4</span>
                    </div>
                    <p>历史记录自动保存，方便回顾</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-700">
                  <h4 className="text-sm font-semibold text-white mb-3">功能特点</h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      实时计算与图表展示
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      专业金融计算公式
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      历史记录本地保存
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      响应式设计，多端适配
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
              © 2025 理财规划计算工具 · 专业金融服务
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>适用于教学与学习场景</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
