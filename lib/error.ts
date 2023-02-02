export enum ErrorType {
  NoSupport = 1,
  // 超时
  Timeout = 2,
  // 多实例
  MultipleInstances = 3,
  // 支付不支持
  InvalidPayment = 4,
  // 未初始化
  Uninitialized = 5,
  // 其它（未识别或原生）
  Other = 0,
}

export class GooglePayError extends Error {
  constructor(message: string, public type: ErrorType, public orignal?: Error) {
    super(message);
  }
}

export function createError(type: ErrorType, orignal?: Error) {
  let message = '';
  switch (type) {
    case ErrorType.NoSupport:
      message = '';
      break;
    case ErrorType.Other:
    default:
      return orignal;
  }
  return new GooglePayError(message, type, orignal);
}
