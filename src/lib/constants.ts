/**
 * 计算器常量配置
 */

import { CompoundFieldType, PaymentType } from '@/types/calculators';

// 简单计算器按钮配置
export const CALCULATOR_BUTTONS = [
  ['C', '⌫', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '^', '=']
];

export const CALCULATOR_OPERATORS = ['+', '-', '×', '÷', '^', '%'];

// 复利计算器字段标签
export const COMPOUND_FIELD_LABELS: Record<CompoundFieldType, string> = {
  r: '年利率 (%)',
  n: '期数 (年)',
  PV: '现值 (PV)',
  PMT: '每期付款 (PMT)',
  FV: '终值 (FV)'
};

// 年金类型标签
export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  beginning: '期初年金（即付年金）',
  end: '期末年金（普通年金）'
};

// 历史记录类型标签颜色
export const HISTORY_TYPE_COLORS: Record<string, string> = {
  simple: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
  compound: 'bg-green-600/20 text-green-400 border-green-600/30',
  irr: 'bg-purple-600/20 text-purple-400 border-purple-600/30',
  default: 'bg-slate-600/20 text-slate-400 border-slate-600/30'
};

// 历史记录类型名称
export const HISTORY_TYPE_NAMES: Record<string, string> = {
  simple: '简单计算',
  compound: '复利年金',
  irr: 'IRR分析',
  default: '未知'
};

// 默认现金流（IRR 计算器）
export const DEFAULT_CASH_FLOWS = [
  { period: 0, amount: -100000 },
  { period: 1, amount: 25000 },
  { period: 2, amount: 30000 },
  { period: 3, amount: 35000 },
  { period: 4, amount: 40000 },
  { period: 5, amount: 45000 }
];

// 计算参数
export const CALCULATION_CONSTANTS = {
  IRR_MAX_ITERATIONS: 1000,
  IRR_TOLERANCE: 0.000001,
  IRR_INITIAL_RATE: 0.1,
  IRR_MIN_RATE: -0.99,
  IRR_MAX_RATE: 10,
  NPV_MIN_RATE: -0.1,
  NPV_MAX_RATE: 0.3,
  NPV_RATE_STEP: 0.01
};

// 本地存储键
export const STORAGE_KEYS = {
  CALCULATOR_HISTORY: 'calculatorHistory',
  MAX_HISTORY_ITEMS: 50
};
