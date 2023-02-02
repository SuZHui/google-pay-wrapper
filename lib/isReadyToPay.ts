import { googlePayClientVersion } from './config';

/**
 * 判断给定的授权方式和信用卡网关是否支持
 */
export async function isReadyToPay(
  client: Googlepay.PaymentsClient,
  {
    allowedAuthMethods = [],
    allowedCardNetworks = [],
  }: Googlepay.CardParameters
) {
  const isReadyToPayRequest: Googlepay.IsReadyToPayRequest = {
    ...googlePayClientVersion,
    allowedPaymentMethods: [
      {
        type: 'CARD',
        parameters: {
          allowedAuthMethods,
          allowedCardNetworks,
        },
      },
    ],
  };
  return client
    .isReadyToPay(isReadyToPayRequest)
    .then(function (response) {
      if (response.result) {
        return client;
      }
    })
    .catch(function (err) {
      // The request was initiated from a security context that the payment agent or the browser chose not to fulfill. Most commonly, this is an insecure browser context error.
      console.log('google-pay:isReadyToPayError', err);
      throw new Error(USER_ERROR_MESSAGE);
    });
}
