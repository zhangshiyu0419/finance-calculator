/**
 * 计算器类型定义
 */

// 历史记录类型
export type CalculatorType = 'simple' | 'compound' | 'irr';

export interface HistoryRecord {
  id: string;
  type: CalculatorType;
  title: string;
  result: string;
  timestamp: number;
  details?: string;
}

// 复利计算器类型
export type CompoundFieldType = 'r' | 'n' | 'PV' | 'PMT' | 'FV';

export interface CompoundValues {
  r: string;      // 年利率 (%)
  n: string;      // 期数 (年)
  PV: string;     // 现值
  PMT: string;    // 每期付款
  FV: string;     // 终值
}

export type PaymentType = 'beginning' | 'end';

// IRR 计算器类型
export interface CashFlow {
  period: number;
  amount: number;
}

export interface NPVData {
  rate: number;
  npv: number;
}

export interface CumulativeData {
  period: number;
  cumulative: number;
}

// 图表数据类型
export interface ChartDataPoint {
  period: number;
  value: number;
}
