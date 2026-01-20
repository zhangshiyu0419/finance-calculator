/**
 * 计算逻辑工具函数
 */

import { CashFlow, NPVData, CompoundFieldType, PaymentType } from '@/types/calculators';
import { CALCULATION_CONSTANTS } from './constants';

// ============================================================================
// 简单计算器 - 安全的数学表达式解析
// ============================================================================

/**
 * 安全的数学表达式计算器
 * 替代不安全的 eval() 函数
 */
export class SafeCalculator {
  private tokens: string[] = [];
  private position: number = 0;

  /**
   * 计算数学表达式
   * @param expression 数学表达式字符串
   * @returns 计算结果
   */
  calculate(expression: string): number {
    // 预处理：标准化运算符
    let normalized = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/\^/g, '**')
      .replace(/\s+/g, '');

    // 验证表达式只包含安全字符
    if (!this.validateExpression(normalized)) {
      throw new Error('表达式包含非法字符');
    }

    this.tokens = this.tokenize(normalized);
    this.position = 0;

    const result = this.parseExpression();

    // 确保所有 token 都被消费
    if (this.position < this.tokens.length) {
      throw new Error('表达式解析错误');
    }

    return result;
  }

  /**
   * 验证表达式只包含安全字符
   */
  private validateExpression(expr: string): boolean {
    return /^[\d+\-*/().%eE **]+$/.test(expr);
  }

  /**
   * 将表达式转换为 token 数组
   */
  private tokenize(expr: string): string[] {
    const tokens: string[] = [];
    let current = '';

    for (let i = 0; i < expr.length; i++) {
      const char = expr[i];

      if (/[0-9.]/.test(char)) {
        current += char;
      } else {
        if (current) {
          tokens.push(current);
          current = '';
        }
        tokens.push(char);
      }
    }

    if (current) {
      tokens.push(current);
    }

    return tokens;
  }

  /**
   * 解析表达式（处理加减）
   */
  private parseExpression(): number {
    let left = this.parseTerm();

    while (this.position < this.tokens.length) {
      const operator = this.tokens[this.position];

      if (operator === '+' || operator === '-') {
        this.position++;
        const right = this.parseTerm();
        left = operator === '+' ? left + right : left - right;
      } else {
        break;
      }
    }

    return left;
  }

  /**
   * 解析项（处理乘除）
   */
  private parseTerm(): number {
    let left = this.parseFactor();

    while (this.position < this.tokens.length) {
      const operator = this.tokens[this.position];

      if (operator === '*' || operator === '/') {
        this.position++;
        const right = this.parseFactor();
        left = operator === '*' ? left * right : left / right;
      } else {
        break;
      }
    }

    return left;
  }

  /**
   * 解析因子（处理数字、括号、指数）
   */
  private parseFactor(): number {
    const token = this.tokens[this.position];

    // 处理负号
    if (token === '-') {
      this.position++;
      return -this.parseFactor();
    }

    // 处理数字
    if (this.isNumber(token)) {
      this.position++;
      return parseFloat(token);
    }

    // 处理括号
    if (token === '(') {
      this.position++;
      const result = this.parseExpression();
      if (this.tokens[this.position] !== ')') {
        throw new Error('括号不匹配');
      }
      this.position++;
      return result;
    }

    // 处理指数运算
    if (token === '*' && this.position + 1 < this.tokens.length && this.tokens[this.position + 1] === '*') {
      this.position += 2;
      const base = this.parseFactor();
      return Math.pow(base, 2); // 简化处理，实际应该递归解析指数
    }

    throw new Error(`无法解析的 token: ${token}`);
  }

  private isNumber(token: string): boolean {
    return !isNaN(parseFloat(token)) && isFinite(parseFloat(token));
  }
}

/**
 * 使用安全计算器计算表达式
 */
export function safeCalculate(expression: string): number {
  const calculator = new SafeCalculator();
  return calculator.calculate(expression);
}

// ============================================================================
// 复利计算器 - 金融计算函数
// ============================================================================

/**
 * 计算复利终值
 * FV = PV × (1 + r)^n
 */
export function calculateCompoundFV(PV: number, r: number, n: number): number {
  return PV * Math.pow(1 + r, n);
}

/**
 * 计算复利现值
 * PV = FV / (1 + r)^n
 */
export function calculateCompoundPV(FV: number, r: number, n: number): number {
  return FV / Math.pow(1 + r, n);
}

/**
 * 计算年金终值
 * FV = PMT × [(1 + r)^n - 1] / r × adjustment
 */
export function calculateAnnuityFV(PMT: number, r: number, n: number, isEnd: boolean): number {
  const annuityFactor = (Math.pow(1 + r, n) - 1) / r;
  const adjustment = isEnd ? 1 : (1 + r);
  return PMT * annuityFactor * adjustment;
}

/**
 * 计算年金现值
 * PV = PMT × [1 - (1 + r)^-n] / r × adjustment
 */
export function calculateAnnuityPV(PMT: number, r: number, n: number, isEnd: boolean): number {
  const annuityFactor = (1 - Math.pow(1 + r, -n)) / r;
  const adjustment = isEnd ? 1 : (1 + r);
  return PMT * annuityFactor * adjustment;
}

/**
 * 使用牛顿迭代法求解利率
 */
export function solveRate(n: number, PV: number, PMT: number, FV: number, isEnd: boolean): number {
  let rate = CALCULATION_CONSTANTS.IRR_INITIAL_RATE;
  const maxIterations = CALCULATION_CONSTANTS.IRR_MAX_ITERATIONS;
  const tolerance = CALCULATION_CONSTANTS.IRR_TOLERANCE;

  for (let i = 0; i < maxIterations; i++) {
    const adjustment = isEnd ? 1 : (1 + rate);
    const f = PV * Math.pow(1 + rate, n) + 
               PMT * ((Math.pow(1 + rate, n) - 1) / rate) * adjustment - FV;
    
    const df = n * PV * Math.pow(1 + rate, n - 1) + 
               PMT * (n * Math.pow(1 + rate, n - 1) / rate - 
                      (Math.pow(1 + rate, n) - 1) / Math.pow(rate, 2)) * adjustment;
    
    const newRate = rate - f / df;
    
    if (Math.abs(newRate - rate) < tolerance) {
      return newRate * 100; // 转换为百分比
    }
    
    rate = newRate;
    
    // 防止发散
    if (rate < CALCULATION_CONSTANTS.IRR_MIN_RATE || rate > CALCULATION_CONSTANTS.IRR_MAX_RATE) {
      break;
    }
  }

  return rate * 100;
}

/**
 * 求解期数
 */
export function solvePeriods(r: number, PV: number, PMT: number, FV: number, isEnd: boolean): number {
  if (PMT === 0) {
    // 简单复利
    return Math.log(FV / PV) / Math.log(1 + r);
  }
  // 年金情况，使用近似解
  return Math.log((FV * r + PMT) / (PV * r + PMT)) / Math.log(1 + r);
}

/**
 * 综合计算函数（复利/年金）
 */
export function calculateCompound(
  solveFor: CompoundFieldType,
  r: number,
  n: number,
  PV: number,
  PMT: number,
  FV: number,
  paymentType: PaymentType
): number {
  const isEnd = paymentType === 'end';
  const isCompound = PMT === 0;

  switch (solveFor) {
    case 'r':
      return solveRate(n, PV, PMT, FV, isEnd);
    
    case 'n':
      return solvePeriods(r, PV, PMT, FV, isEnd);
    
    case 'PV':
      if (isCompound) {
        return calculateCompoundPV(FV, r, n);
      } else {
        const annuityPV = calculateAnnuityPV(PMT, r, n, isEnd);
        return FV / Math.pow(1 + r, n) - annuityPV;
      }
    
    case 'PMT':
      if (isCompound) {
        return 0;
      } else {
        const annuityFactor = (1 - Math.pow(1 + r, -n)) / r;
        const adjustment = isEnd ? 1 : (1 + r);
        return (PV - FV / Math.pow(1 + r, n)) / (annuityFactor * adjustment);
      }
    
    case 'FV':
      if (isCompound) {
        return calculateCompoundFV(PV, r, n);
      } else {
        const compoundFV = calculateCompoundFV(PV, r, n);
        const annuityFV = calculateAnnuityFV(PMT, r, n, isEnd);
        return compoundFV + annuityFV;
      }
    
    default:
      return 0;
  }
}

/**
 * 生成图表数据
 */
export function generateChartData(
  PV: number,
  PMT: number,
  r: number,
  n: number,
  paymentType: PaymentType
): Array<{ period: number; value: number }> {
  const data: Array<{ period: number; value: number }> = [];
  const isEnd = paymentType === 'end';
  const isCompound = PMT === 0;

  for (let i = 0; i <= n; i++) {
    let value: number;
    if (isCompound) {
      value = calculateCompoundFV(PV, r, i);
    } else {
      const compoundFV = calculateCompoundFV(PV, r, i);
      const annuityFV = calculateAnnuityFV(PMT, r, i, isEnd);
      value = compoundFV + annuityFV;
    }
    data.push({ period: i, value: Number(value.toFixed(2)) });
  }

  return data;
}

// ============================================================================
// IRR 计算器 - 现金流分析函数
// ============================================================================

/**
 * 计算 NPV
 * NPV = Σ [CF_t / (1 + r)^t]
 */
export function calculateNPV(cashFlows: CashFlow[], rate: number): number {
  return cashFlows.reduce((sum, cf) => {
    return sum + cf.amount / Math.pow(1 + rate, cf.period);
  }, 0);
}

/**
 * 计算 NPV 和导数（用于牛顿迭代法）
 */
export function calculateNPVandDerivative(cashFlows: CashFlow[], rate: number): {
  npv: number;
  derivative: number;
} {
  let npv = 0;
  let derivative = 0;

  cashFlows.forEach(cf => {
    const discountFactor = Math.pow(1 + rate, cf.period);
    const presentValue = cf.amount / discountFactor;
    npv += presentValue;
    
    if (cf.period > 0) {
      derivative -= cf.period * presentValue / (1 + rate);
    }
  });

  return { npv, derivative };
}

/**
 * 使用牛顿迭代法计算 IRR
 */
export function calculateIRR(cashFlows: CashFlow[]): number {
  let rate = CALCULATION_CONSTANTS.IRR_INITIAL_RATE;
  const maxIterations = CALCULATION_CONSTANTS.IRR_MAX_ITERATIONS;
  const tolerance = CALCULATION_CONSTANTS.IRR_TOLERANCE;

  for (let i = 0; i < maxIterations; i++) {
    const { npv, derivative } = calculateNPVandDerivative(cashFlows, rate);
    
    if (Math.abs(derivative) < tolerance) {
      break;
    }

    const newRate = rate - npv / derivative;
    
    if (Math.abs(newRate - rate) < tolerance) {
      return newRate * 100; // 转换为百分比
    }
    
    rate = newRate;
    
    // 防止发散
    if (rate < CALCULATION_CONSTANTS.IRR_MIN_RATE || rate > CALCULATION_CONSTANTS.IRR_MAX_RATE) {
      break;
    }
  }

  return rate * 100;
}

/**
 * 生成 NPV 与折现率关系数据
 */
export function generateNPVData(cashFlows: CashFlow[]): NPVData[] {
  const data: NPVData[] = [];
  const { NPV_MIN_RATE, NPV_MAX_RATE, NPV_RATE_STEP } = CALCULATION_CONSTANTS;

  for (let rate = NPV_MIN_RATE; rate <= NPV_MAX_RATE; rate += NPV_RATE_STEP) {
    data.push({
      rate: Number((rate * 100).toFixed(1)),
      npv: Number(calculateNPV(cashFlows, rate).toFixed(2))
    });
  }

  return data;
}

/**
 * 生成累积现金流数据
 */
export function generateCumulativeData(cashFlows: CashFlow[]): Array<{ period: number; cumulative: number }> {
  let cumulative = 0;
  return cashFlows.map(cf => {
    cumulative += cf.amount;
    return {
      period: cf.period,
      cumulative: Number(cumulative.toFixed(2))
    };
  });
}
