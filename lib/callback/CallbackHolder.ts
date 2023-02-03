export class CallbackHolder {
  paymentDataChangedHandler: Googlepay.PaymentDataChangedHandler;
  paymentAuthorizedHandler: Googlepay.PaymentAuthorizedHandler = function () {
    return Promise.resolve({ transactionState: 'SUCCESS' });
  };
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
  onPaymentAuthorized(cb: Googlepay.PaymentAuthorizedHandler) {
    if (typeof cb === 'function') {
      this.paymentAuthorizedHandler = cb;
    }
  }

  // getPaymentDataCallback(
  //   request: Googlepay.PaymentDataRequest
  // ): Googlepay.PaymentDataChangedHandler | undefined {
  //   const { shippingOptionRequired, shippingAddressRequired } = request;
  //   if (shippingAddressRequired || shippingOptionRequired) {
  //     return this.paymentDataChangedHandler;
  //   }
  //   return;
  // }
}
