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
  // 开发错误
  Developer = 6,
  // 谷歌账户验证失败
  InvalidAccount = 7,
  // 其它（未识别或原生）
  Other = 0,
}

export class GooglePayError extends Error {
  readonly isSDK;
  constructor(
    message: string,
    public type: ErrorType,
    public orignal?: Error | Googlepay.PaymentsError
  ) {
    super(message);
    this.isSDK = isSDKError(this.orignal);
  }
}

export function createError(
  type: ErrorType,
  orignal?: Error | Googlepay.PaymentsError
) {
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
    case ErrorType.Developer:
      message =
        'Developer error, please check `orginal` property get more infomations.';
      break;
    case ErrorType.InvalidAccount:
      message =
        'The current Google user is unable to provide payment information.';
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

export function isCanceled(err: unknown) {
  if (isSDKError(err)) {
    return err.statusCode === 'CANCELED' && !err.statusMessage;
  } else {
    return (
      err instanceof Error &&
      err.message === 'User closed the Payment Request UI.'
    );
  }
}

/**
 * 处理loadPaymentData可能出现的错误
 */
export function formatError(
  err: Googlepay.PaymentsError | GooglePayError | Error
) {
  console.log('process error');
  console.error(err);
  if (err instanceof GooglePayError) {
    return err;
  }
  let type = ErrorType.Other;
  if (isSDKError(err)) {
    if (err.statusCode === 'DEVELOPER_ERROR') {
      type = ErrorType.Developer;
    }
    return createError(type, err);
  }

  if (err instanceof Error) {
    switch (err.message) {
      case 'The "paymentrequest" event timed out after 5 minutes.':
        type = ErrorType.Timeout;
        break;
      case 'This method can only be called one at a time.':
        type = ErrorType.MultipleInstances;
        break;
    }
  }

  return createError(ErrorType.Other, err);
}

function isSDKError(e: unknown): e is Googlepay.PaymentsError {
  if (typeof e === 'object') {
    // && 'statusMessage' in e
    return 'statusCode' in e;
  }
  return false;
}
