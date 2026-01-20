'use client';

import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { addHistoryRecord } from '@/components/HistoryPanel';
import { CompoundFieldType, CompoundValues, PaymentType } from '@/types/calculators';
import { COMPOUND_FIELD_LABELS, PAYMENT_TYPE_LABELS } from '@/lib/constants';
import { calculateCompound, generateChartData } from '@/lib/calculations';

export default function CompoundCalculator() {
  const [values, setValues] = useState<CompoundValues>({
    r: '',
    n: '',
    PV: '',
    PMT: '',
    FV: ''
  });
  const [solveFor, setSolveFor] = useState<CompoundFieldType>('FV');
  const [paymentType, setPaymentType] = useState<PaymentType>('end');
  const [result, setResult] = useState<number | null>(null);
  const [chartData, setChartData] = useState<Array<{ period: number; value: number }>>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * 处理输入值变化
   */
  const handleValueChange = useCallback((key: CompoundFieldType, value: string) => {
    setError(null);
    setValues(prev => ({ ...prev, [key]: value }));
  }, []);

  /**
   * 验证输入
   */
  const validateInputs = useCallback((): boolean => {
    const r = values.r === '' ? 0 : parseFloat(values.r) / 100;
    const n = values.n === '' ? 0 : parseFloat(values.n);

    // 检查必要字段：利率和期数必须有值
    if (solveFor !== 'r' && (isNaN(r) || r === 0)) {
      setError('请输入有效的利率');
      return false;
    }
    if (solveFor !== 'n' && (isNaN(n) || n === 0)) {
      setError('请输入有效的期数');
      return false;
    }

    return true;
  }, [values, solveFor]);

  /**
   * 执行计算
   */
  const calculate = useCallback(() => {
    if (!validateInputs()) {
      return;
    }

    try {
      const r = values.r === '' ? 0 : parseFloat(values.r) / 100;
      const n = values.n === '' ? 0 : parseFloat(values.n);
      const PV = values.PV === '' ? 0 : parseFloat(values.PV);
      const PMT = values.PMT === '' ? 0 : parseFloat(values.PMT);
      const FV = values.FV === '' ? 0 : parseFloat(values.FV);

      const calculatedValue = calculateCompound(solveFor, r, n, PV, PMT, FV, paymentType);
      setResult(calculatedValue);

      // 生成图表数据
      const data = generateChartData(PV, PMT, r, n, paymentType);
      setChartData(data);

      // 保存到全局历史记录
      const title = `${COMPOUND_FIELD_LABELS[solveFor]} - ${values.PV ? 'PV:' + values.PV : ''} ${values.PMT ? 'PMT:' + values.PMT : ''}`;
      addHistoryRecord({
        type: 'compound',
        title,
        result: `${COMPOUND_FIELD_LABELS[solveFor]}: ${calculatedValue.toFixed(2)}`,
        details: `利率: ${values.r}% · 期数: ${values.n}年${values.PMT ? ' · 年金: ' + values.PMT : ''}`,
      });

      setError(null);
    } catch (err) {
      setError('计算失败，请检查输入参数');
      console.error('计算错误:', err);
    }
  }, [values, solveFor, paymentType, validateInputs]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>复利与年金计算器</CardTitle>
        <CardDescription>计算复利、年金和投资回报 · 利率和期数为必填，其他参数默认为0</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 错误提示 */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* 选择要计算的参数 */}
        <div className="space-y-2">
          <Label>选择要计算的参数</Label>
          <Select value={solveFor} onValueChange={(value) => {
            setError(null);
            setSolveFor(value as CompoundFieldType);
          }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(COMPOUND_FIELD_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 输入字段 */}
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(COMPOUND_FIELD_LABELS).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <Label className={key === solveFor ? 'text-primary' : ''}>
                {label} {key === solveFor ? '(将计算)' : ''}
              </Label>
              <Input
                type="number"
                step="0.01"
                value={values[key as CompoundFieldType]}
                onChange={(e) => handleValueChange(key as CompoundFieldType, e.target.value)}
                disabled={key === solveFor}
                placeholder={
                  key === solveFor 
                    ? '自动计算' 
                    : key === 'r' || key === 'n'
                    ? '必填'
                    : '默认为0'
                }
              />
            </div>
          ))}
        </div>

        {/* 年金类型 */}
        <div className="space-y-2">
          <Label>年金类型</Label>
          <Select value={paymentType} onValueChange={(value) => setPaymentType(value as PaymentType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PAYMENT_TYPE_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 计算按钮 */}
        <Button onClick={calculate} className="w-full">
          计算
        </Button>

        {/* 结果展示 */}
        {result !== null && (
          <div className="bg-primary/10 p-4 rounded-lg space-y-2">
            <p className="text-sm font-semibold">计算结果</p>
            <p className="text-2xl font-bold text-primary">
              {COMPOUND_FIELD_LABELS[solveFor]}: {result.toFixed(2)}
            </p>
            {solveFor === 'r' && <p className="text-sm text-muted-foreground">年化利率</p>}
          </div>
        )}

        {/* 图表展示 */}
        {chartData.length > 0 && (
          <div className="space-y-2">
            <Label>增长曲线</Label>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" label={{ value: '期数', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: '金额', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `¥${value}`} />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={{ fill: '#8884d8' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
