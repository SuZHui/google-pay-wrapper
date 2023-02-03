import { CallbackHolder } from './callback/CallbackHolder';
import { GooglePay } from './GooglePay';

function getCallbaks(holder: CallbackHolder) {
  const keys: Array<keyof CallbackHolder> = [
    'onPaymentDataChanged',
    'onBackFromGoogleAuth',
    'onPaymentAuthorized',
  ];
  return keys.reduce((o, name) => {
    o[name] = holder[name];
    return o;
  }, {} as Record<keyof CallbackHolder, CallbackHolder[keyof CallbackHolder]>);
}

export function useGooglePay(env: Googlepay.Environment) {
  const instance = new GooglePay(env);
  const callbacks = instance.getCallbackHolder();
  const { doAuthorize } = instance;
  return {
    doAuthorize,
    ...getCallbaks(callbacks),
  };
}
