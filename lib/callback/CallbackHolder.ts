type CB<T, R> = (p: T) => R;

type OnPaymentAuthorizedCallback = CB<
  google.payments.api.PaymentData,
  Promise<google.payments.api.PaymentAuthorizationResult>
>;

export class CallbackHolder {
  paymentDataChangedHandler: Googlepay.PaymentDataChangedHandler;
  paymentAuthorizedHandler = function () {
    return Promise.resolve({ transactionState: 'SUCCESS' });
  } as OnPaymentAuthorizedCallback;
  // 从谷歌账户授权登录页返回到商城时触发
  backFromGoogleAuthHandler: () => void;

  onPaymentDataChanged(cb: Googlepay.PaymentDataChangedHandler) {
    if (typeof cb === 'function') {
      this.paymentDataChangedHandler = cb;
    }
  }
  onBackFromGoogleAuth(cb: () => void) {
    if (typeof cb === 'function') {
      this.backFromGoogleAuthHandler = cb;
    }
  }
  onPaymentAuthorized(cb: OnPaymentAuthorizedCallback) {
    if (typeof cb === 'function') {
      this.paymentAuthorizedHandler = cb;
    }
  }

  getPaymentDataCallback(
    request: Googlepay.PaymentDataRequest
  ): Googlepay.PaymentDataChangedHandler | undefined {
    const { shippingOptionRequired, shippingAddressRequired } = request;
    if (shippingAddressRequired || shippingOptionRequired) {
      return this.paymentDataChangedHandler;
    }
    return;
  }
}
