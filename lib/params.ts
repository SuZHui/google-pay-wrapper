import { googlePayClientVersion } from './config';

type PaymentDataRequestParams = {
  merchantInfo: Googlepay.MerchantInfo;
  transactionInfo: Googlepay.TransactionInfo;
  allowedPaymentMethods: Googlepay.PaymentMethodSpecification[];
  shippingAddressRequired: boolean;
  shippingOptionRequired: boolean;
};

export function createPaymentDataRequest({
  merchantInfo,
  transactionInfo,
  allowedPaymentMethods = [],
  shippingAddressRequired = false,
  shippingOptionRequired = false,
}: PaymentDataRequestParams): Googlepay.PaymentDataRequest {
  const requestData = {
    ...googlePayClientVersion,
    merchantInfo,
    allowedPaymentMethods,
    transactionInfo,
    shippingAddressRequired,
    shippingOptionRequired,
    // TODO: 考虑是否该属性移到调用方手动追加？
    callbackIntents: ['PAYMENT_AUTHORIZATION'] as Googlepay.CallbackIntent[],
  };

  shippingAddressRequired &&
    requestData.callbackIntents.push('SHIPPING_ADDRESS');
  shippingOptionRequired && requestData.callbackIntents.push('SHIPPING_OPTION');

  return requestData;
}
