import { CallbackHolder } from './callback/CallbackHolder';
import { createError, ErrorType } from './error';
import { isReadyToPay } from './isReadyToPay';
import { createPaymentDataRequest } from './params';

export class GooglePay {
  private cbHolder = new CallbackHolder();
  constructor(private environment: Googlepay.Environment = 'PRODUCTION') {
    this.handleGooglePageBack.bind(this);
  }

  private getClient(payload: Googlepay.PaymentDataRequest) {
    return new google.payments.api.PaymentsClient({
      environment: this.environment,
      paymentDataCallbacks: {
        onPaymentDataChanged: this.cbHolder.getPaymentDataCallback(payload),
        onPaymentAuthorized: (...args) =>
          this.cbHolder.paymentAuthorizedHandler?.(...args),
      },
    });
  }

  private handleGooglePageBack() {
    const isPageBack =
      window.performance?.navigation?.type ===
        window?.PerformanceNavigation?.TYPE_BACK_FORWARD ?? 2;
    const isBackFromGoogleAccountPage = true;
    if (this.getIsExecuting() && isPageBack && isBackFromGoogleAccountPage) {
      this.cbHolder?.backFromGoogleAuthHandler?.();
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
  // request google pay token
  async doAuthorize(params: Parameters<typeof createPaymentDataRequest>[0]) {
    const payload = createPaymentDataRequest(params);
    const client = this.getClient(payload);
    if (!client) {
      throw createError(ErrorType.Uninitialized);
    }

    const parameters = payload?.allowedPaymentMethods?.[0]?.parameters;
    if (!parameters) {
      throw createError(ErrorType.InvalidPaymentDataRequest);
    }

    await isReadyToPay(client, parameters).catch((err) => {
      throw createError(ErrorType.NoSupport, err);
    });

    // TODO: if is executing should stop process
    this.setIsExecuting(true);
    try {
      // TODO: process payment data request
      return client.loadPaymentData(payload);
    } catch (err) {
      throw err;
    } finally {
      this.setIsExecuting(false);
    }
  }

  getCallbackHolder() {
    return this.cbHolder;
  }
}
