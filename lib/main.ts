import { CallbackHolder } from './callback/CallbackHolder';
import { GooglePay } from './GooglePay';

export function useGooglePay(env: Googlepay.Environment) {
  const callbackHolder = new CallbackHolder();
  const { onBackFromGoogleAuth } = callbackHolder;
  return {
    createClient(options: Googlepay.PaymentOptions = {}) {
      options.environment = options?.environment ?? env;
      const client = new google.payments.api.PaymentsClient(options);
      return new GooglePay(client, callbackHolder);
    },
    onBackFromGoogleAuth,
  };
}
