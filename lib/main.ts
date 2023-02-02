import { isReadyToPay } from './isReadyToPay';
import { GooglePay } from './GooglePay';
import { createError, ErrorType } from './error';

export function useGooglePay(env: Googlepay.Environment) {
  let client;
  const instance = new GooglePay(env);
  return {
    createPayment(payload: Googlepay.PaymentDataRequest) {
      return instance.createPayment(payload);
    },
    isReadyToPay() {
      const client = instance.getClient();
      if (!client) {
        throw createError(ErrorType.Uninitialized);
      }
      // TODO: PAYMENT REQUST 从instance缓存对象中获取，不再从入参获取
      return isReadyToPay(client);
    },
  };
}
