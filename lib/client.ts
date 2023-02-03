import { CallbackHolder } from './callback/CallbackHolder';
import { GooglePay } from './GooglePay';

export function createClient(
  options: Googlepay.PaymentOptions,
  callbackHolder: CallbackHolder
) {
  // TODO: 挂载的事件无法正确触发
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
