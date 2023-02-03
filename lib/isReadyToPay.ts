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
  return client.isReadyToPay(isReadyToPayRequest).then(function (response) {
    if (response.result) {
      return client;
    }
  });
}
