import { CallbackHolder } from './callback/CallbackHolder';
import { createClient } from './client';

function getCallbaks(holder: CallbackHolder) {
  const keys: Array<keyof CallbackHolder> = [
    'onPaymentDataChanged',
    'onBackFromGoogleAuth',
    'onPaymentAuthorized',
  ];
  return keys.reduce((o, name) => {
    o[name] = holder[name].bind(holder);
    return o;
  }, {} as Record<keyof CallbackHolder, CallbackHolder[keyof CallbackHolder]>);
}

export function useGooglePay(env: Googlepay.Environment) {
  const callbackHolder = new CallbackHolder();
  return {
    createClient(options: Googlepay.PaymentOptions = {}) {
      options.environment = options?.environment ?? env;
      return createClient(options, callbackHolder);
    },
    ...getCallbaks(callbackHolder),
  };
}
