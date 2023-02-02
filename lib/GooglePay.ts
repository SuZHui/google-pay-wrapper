import { CallbackHolder } from './callback/CallbackHolder';

export class GooglePay {
  private cbHolder = new CallbackHolder();
  private client: google.payments.api.PaymentsClient | undefined;
  constructor(private environment: Googlepay.Environment = 'PRODUCTION') {
    this.handleGooglePageBack.bind(this);
  }

  private getClient(payload: Googlepay.PaymentDataRequest) {
    if (!this.client) {
      this.client = new google.payments.api.PaymentsClient({
        environment: this.environment,
        paymentDataCallbacks: {
          onPaymentDataChanged: this.cbHolder.getPaymentDataCallback(payload),
          onPaymentAuthorized: (...args) =>
            this.cbHolder.paymentAuthorizedHandler?.(...args),
        },
      });
    }
    return this.client;
  }

  createPayment(payload: Googlepay.PaymentDataRequest) {
    // TODO: cache payload for this session
    const client = this.getClient(payload);
  }

  private handleGooglePageBack() {
    const isPageBack =
      window.performance?.navigation?.type ===
        window?.PerformanceNavigation?.TYPE_BACK_FORWARD ?? 2;
    const isBackFromGoogleAccountPage = true;
    if (this.getIsExecuting() && isPageBack && isBackFromGoogleAccountPage) {
      this.callbacks?.onBackFromGoogleAuth?.();
    }
  }

  private setIsExecuting(is = false) {
    if (is) {
      sessionStorage.setItem('google_pay_is_executing', '1');
      window.addEventListener('pageshow', this.handleGooglePageBack);
    } else {
      sessionStorage.removeItem('google_pay_is_executing');
      window.removeEventListener('pageshow', this.handleGooglePageBack);
    }
  }

  private getIsExecuting() {
    return !!sessionStorage.getItem('google_pay_is_executing');
  }

  getClient() {
    return this.client;
  }

  execute(payload: google.payments.api.PaymentDataRequest) {
    if (!this.client) {
      throw new Error();
    }
    // TODO: if is executing should stop process
    this.setIsExecuting(true);
  }
}
