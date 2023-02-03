import { CallbackHolder } from './callback/CallbackHolder';
import { createError, ErrorType, formatError, isCanceled } from './error';
import { isReadyToPay } from './isReadyToPay';
import { createPaymentDataRequest } from './params';

export class GooglePay {
  constructor(
    private client: Googlepay.PaymentsClient,
    private cbHolder: CallbackHolder
  ) {
    this.handleGooglePageBack = this.handleGooglePageBack.bind(this);
    window.addEventListener('unload', () => {
      this.setIsExecuting(false);
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

  async loadPaymentData(
    params: Parameters<typeof createPaymentDataRequest>[0]
  ) {
    const payload = createPaymentDataRequest(params);
    this.setIsExecuting(true);
    try {
      const parameters = payload?.allowedPaymentMethods?.[0]?.parameters;
      if (!parameters) {
        throw createError(ErrorType.InvalidPaymentDataRequest);
      }
      await isReadyToPay(this.client, parameters).catch((err) => {
        throw createError(ErrorType.NoSupport, err);
      });

      // TODO: process payment data request
      const data = await this.client.loadPaymentData(payload);
      return { data, isCanceled: false };
    } catch (err) {
      if (isCanceled(err)) return { isCanceled: true };
      throw formatError(err);
    } finally {
      this.setIsExecuting(false);
    }
  }

  createButton(options: Googlepay.ButtonOptions) {
    return this.client.createButton(options);
  }
}
