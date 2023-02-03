import { CallbackHolder } from './callback/CallbackHolder';
import { GooglePay } from './GooglePay';

export function createClient(
  options: Googlepay.PaymentOptions,
  callbackHolder: CallbackHolder
) {
  // TODO: 挂载的事件无法正确触发
  // 判断是否用户传入了回调 如果传入 就 用holder包裹一层
  const {
    onPaymentDataChanged = callbackHolder.paymentDataChangedHandler,
    onPaymentAuthorized = callbackHolder.paymentAuthorizedHandler,
  } = options?.paymentDataCallbacks ?? {};

  const client = new google.payments.api.PaymentsClient({
    environment: options.environment,
    paymentDataCallbacks: {
      onPaymentDataChanged,
      onPaymentAuthorized,
    },
  });

  return new GooglePay(client, callbackHolder);
}
