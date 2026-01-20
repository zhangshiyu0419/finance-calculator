'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { addHistoryRecord } from '@/components/HistoryPanel';
import { CALCULATOR_BUTTONS, CALCULATOR_OPERATORS } from '@/lib/constants';
import { safeCalculate } from '@/lib/calculations';

export default function SimpleCalculator() {
  const [display, setDisplay] = useState('0');
  const [formula, setFormula] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * 处理数字输入
   */
  const handleNumber = useCallback((num: string) => {
    setError(null);
    if (display === '0' && num !== '.') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  }, [display]);

  /**
   * 处理运算符输入
   */
  const handleOperator = useCallback((op: string) => {
    setError(null);
    
    // 百分号是独立功能
    if (op === '%') {
      const num = parseFloat(display);
      if (!isNaN(num)) {
        const result = num / 100;
        setDisplay(String(result));
        
        // 保存到本地历史记录
        const expression = `${num}%`;
        setHistory(prev => [...prev.slice(-4), `${expression} = ${result}`]);
      }
      return;
    }

    // 防止以 - 开头以外的负数情况
    if (display === '0' && op !== '-') return;

    setFormula(formula + display + ' ' + op + ' ');
    setDisplay('0');
  }, [display, formula]);

  /**
   * 处理等号计算
   */
  const handleEquals = useCallback(() => {
    try {
      setError(null);
      let expression = formula + display;
      let displayExpression = expression;
      
      // 替换运算符
      expression = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**');
      
      // 使用安全的计算器
      const result = safeCalculate(expression);
      const resultStr = Number.isFinite(result) ? result.toString() : '错误';
      
      if (resultStr === '错误') {
        setError('计算结果超出范围');
        return;
      }
      
      // 保存到本地历史记录
      setHistory(prev => [...prev.slice(-4), `${displayExpression} = ${resultStr}`]);
      
      // 保存到全局历史记录
      if (Number.isFinite(result)) {
        addHistoryRecord({
          type: 'simple',
          title: displayExpression,
          result: resultStr,
        });
      }
      
      setDisplay(resultStr);
      setFormula('');
    } catch (err) {
      setError('计算错误，请检查输入');
      setFormula('');
    }
  }, [formula, display]);

  /**
   * 清除输入
   */
  const handleClear = useCallback(() => {
    setDisplay('0');
    setFormula('');
    setError(null);
  }, []);

  /**
   * 退格
   */
  const handleBackspace = useCallback(() => {
    setError(null);
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  }, [display]);

  /**
   * 处理按钮点击
   */
  const handleButtonClick = useCallback((btn: string) => {
    if (btn === 'C') {
      handleClear();
    } else if (btn === '⌫') {
      handleBackspace();
    } else if (btn === '=') {
      handleEquals();
    } else if (CALCULATOR_OPERATORS.includes(btn)) {
      handleOperator(btn);
    } else {
      handleNumber(btn);
    }
  }, [handleClear, handleBackspace, handleEquals, handleOperator, handleNumber]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>简单科学计算器</CardTitle>
        <CardDescription>支持加减乘除、百分比和指数运算</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 显示区域 */}
        <div className="bg-gray-900 text-white p-4 rounded-lg space-y-2">
          <div className="text-right text-gray-400 text-sm h-6 overflow-hidden">
            {formula}
          </div>
          <div className="text-right text-3xl font-mono overflow-hidden">
            {display}
          </div>
          {error && (
            <div className="text-right text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* 本地历史记录 */}
        {history.length > 0 && (
          <div className="bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
            <p className="text-sm font-semibold mb-2">计算历史</p>
            {history.map((item, index) => (
              <p key={index} className="text-sm text-gray-600 truncate">
                {item}
              </p>
            ))}
          </div>
        )}

        {/* 按钮区域 */}
        <div className="grid grid-cols-4 gap-2">
          {CALCULATOR_BUTTONS.map((row, i) => (
            <div key={i} className="contents">
              {row.map((btn, j) => (
                <Button
                  key={`${i}-${j}`}
                  onClick={() => handleButtonClick(btn)}
                  variant={
                    CALCULATOR_OPERATORS.includes(btn) || btn === '=' 
                      ? 'default' 
                      : btn === 'C' || btn === '⌫'
                      ? 'destructive'
                      : 'outline'
                  }
                  className={btn === '=' ? 'col-span-1' : ''}
                >
                  {btn}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
