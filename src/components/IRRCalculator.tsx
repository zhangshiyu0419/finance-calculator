'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { addHistoryRecord } from '@/components/HistoryPanel';
import { CashFlow } from '@/types/calculators';
import { DEFAULT_CASH_FLOWS } from '@/lib/constants';
import { calculateIRR, generateNPVData, generateCumulativeData } from '@/lib/calculations';

export default function IRRCalculator() {
  const [cashFlows, setCashFlows] = useState<CashFlow[]>(DEFAULT_CASH_FLOWS);
  const [irr, setIRR] = useState<number | null>(null);
  const [npvs, setNPVs] = useState<Array<{ rate: number; npv: number }>>([]);
  const [cumulativeData, setCumulativeData] = useState<Array<{ period: number; cumulative: number }>>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * 处理现金流变化
   */
  const handleCashFlowChange = useCallback((index: number, field: 'period' | 'amount', value: string) => {
    setError(null);
    const newCashFlows = [...cashFlows];
    newCashFlows[index][field] = parseFloat(value) || 0;
    setCashFlows(newCashFlows);
  }, [cashFlows]);

  /**
   * 添加现金流
   */
  const addCashFlow = useCallback(() => {
    setError(null);
    const lastPeriod = cashFlows.length > 0 ? Math.max(...cashFlows.map(cf => cf.period)) : 0;
    setCashFlows([...cashFlows, { period: lastPeriod + 1, amount: 0 }]);
  }, [cashFlows]);

  /**
   * 删除现金流
   */
  const removeCashFlow = useCallback((index: number) => {
    if (cashFlows.length > 1) {
      setError(null);
      setCashFlows(cashFlows.filter((_, i) => i !== index));
    }
  }, [cashFlows]);

  /**
   * 执行计算
   */
  const calculate = useCallback(() => {
    setError(null);

    if (cashFlows.length < 2) {
      setError('请至少输入两个现金流');
      return;
    }

    try {
      const irrValue = calculateIRR(cashFlows);
      const validIRR = isNaN(irrValue) || !isFinite(irrValue) ? null : irrValue;
      setIRR(validIRR);

      if (validIRR === null) {
        setError('无法计算IRR，请检查现金流数据');
        return;
      }

      // 计算不同折现率下的NPV
      const npvData = generateNPVData(cashFlows);
      setNPVs(npvData);

      // 计算累积现金流
      const cumulativeData = generateCumulativeData(cashFlows);
      setCumulativeData(cumulativeData);

      // 保存到全局历史记录
      const totalInvestment = cashFlows.filter(cf => cf.amount < 0).reduce((sum, cf) => sum + cf.amount, 0);
      const totalReturn = cashFlows.filter(cf => cf.amount > 0).reduce((sum, cf) => sum + cf.amount, 0);
      
      addHistoryRecord({
        type: 'irr',
        title: `投资¥${Math.abs(totalInvestment).toFixed(2)}，回报¥${totalReturn.toFixed(2)}`,
        result: `IRR = ${validIRR.toFixed(2)}%`,
        details: `现金流: ${cashFlows.length}期 · 投资总额: ¥${Math.abs(totalInvestment).toFixed(2)}`,
      });

    } catch (err) {
      setError('计算失败，请检查现金流数据');
      console.error('IRR计算错误:', err);
    }
  }, [cashFlows]);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>内在报酬率 (IRR) 计算器</CardTitle>
        <CardDescription>计算投资项目的内部收益率</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 错误提示 */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* 现金流输入 */}
        <div className="space-y-3">
          <Label>现金流</Label>
          <div className="space-y-2">
            {cashFlows.map((cf, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="期数"
                  value={cf.period}
                  onChange={(e) => handleCashFlowChange(index, 'period', e.target.value)}
                  className="w-24"
                />
                <Input
                  type="number"
                  placeholder="现金流"
                  value={cf.amount}
                  onChange={(e) => handleCashFlowChange(index, 'amount', e.target.value)}
                  className="flex-1"
                />
                {cashFlows.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCashFlow(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button variant="outline" onClick={addCashFlow} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            添加现金流
          </Button>
        </div>

        {/* 计算按钮 */}
        <Button onClick={calculate} className="w-full">
          计算 IRR
        </Button>

        {/* 结果展示 */}
        {irr !== null && (
          <div className="bg-primary/10 p-4 rounded-lg space-y-2">
            <p className="text-sm font-semibold">计算结果</p>
            <p className="text-3xl font-bold text-primary">
              IRR = {irr.toFixed(2)}%
            </p>
            <p className="text-sm text-muted-foreground">
              {irr > 0 ? '✓ 项目可行（IRR > 0）' : '✗ 项目不可行（IRR < 0）'}
            </p>
          </div>
        )}

        {/* NPV vs 折现率图表 */}
        {npvs.length > 0 && (
          <div className="space-y-2">
            <Label>NPV 与折现率关系</Label>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={npvs}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rate" label={{ value: '折现率 (%)', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'NPV', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `¥${value}`} />
                <Line type="monotone" dataKey="npv" stroke="#8884d8" strokeWidth={2} dot={{ fill: '#8884d8' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* 现金流柱状图 */}
        {cashFlows.length > 0 && (
          <div className="space-y-2">
            <Label>现金流分布</Label>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cashFlows}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" label={{ value: '期数', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: '现金流', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `¥${value}`} />
                <Bar 
                  dataKey="amount" 
                  fill="#8884d8"
                  name="现金流"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
