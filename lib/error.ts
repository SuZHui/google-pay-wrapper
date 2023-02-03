export enum ErrorType {
  NoSupport = 1,
  // 超时
  Timeout = 2,
  // 多实例
  MultipleInstances = 3,
  // 无效的支付参数
  InvalidPaymentDataRequest = 4,
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
      message =
        'Google Pay does not support your browser, Please change your browser or use another payment method to pay.';
      break;
    case ErrorType.Timeout:
      message =
        'Request timed out, please try again or use another payment method.';
      break;
    case ErrorType.MultipleInstances:
      message = 'This method can only be called once a time, Please try again.';
      break;
    case ErrorType.InvalidPaymentDataRequest:
      message = 'Payment data error, Please check and try again.';
      break;
    case ErrorType.Uninitialized:
      message =
        'Google pay client could not be create, please refresh the page and try again.';
      break;
    case ErrorType.Other:
    default:
      if (!orignal) {
        return new GooglePayError('Unknown error', type);
      }
      return orignal;
  }
  return new GooglePayError(message, type, orignal);
}
