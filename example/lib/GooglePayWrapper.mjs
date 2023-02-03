class u {
  paymentDataChangedHandler;
  paymentAuthorizedHandler = function() {
    return Promise.resolve({ transactionState: "SUCCESS" });
  };
  // 从谷歌账户授权登录页返回到商城时触发
  backFromGoogleAuthHandler;
  onPaymentDataChanged(e) {
    typeof e == "function" && (this.paymentDataChangedHandler = e);
  }
  onBackFromGoogleAuth(e) {
    typeof e == "function" && (this.backFromGoogleAuthHandler = e);
  }
  onPaymentAuthorized(e) {
    typeof e == "function" && (this.paymentAuthorizedHandler = e);
  }
  getPaymentDataCallback(e) {
    const { shippingOptionRequired: a, shippingAddressRequired: n } = e;
    if (n || a)
      return this.paymentDataChangedHandler;
  }
}
var i = /* @__PURE__ */ ((t) => (t[t.NoSupport = 1] = "NoSupport", t[t.Timeout = 2] = "Timeout", t[t.MultipleInstances = 3] = "MultipleInstances", t[t.InvalidPaymentDataRequest = 4] = "InvalidPaymentDataRequest", t[t.Uninitialized = 5] = "Uninitialized", t[t.Other = 0] = "Other", t))(i || {});
class l extends Error {
  constructor(e, a, n) {
    super(e), this.type = a, this.orignal = n;
  }
}
function r(t, e) {
  let a = "";
  switch (t) {
    case 1:
      a = "Google Pay does not support your browser, Please change your browser or use another payment method to pay.";
      break;
    case 2:
      a = "Request timed out, please try again or use another payment method.";
      break;
    case 3:
      a = "This method can only be called once a time, Please try again.";
      break;
    case 4:
      a = "Payment data error, Please check and try again.";
      break;
    case 5:
      a = "Google pay client could not be create, please refresh the page and try again.";
      break;
    case 0:
    default:
      return e || new l("Unknown error", t);
  }
  return new l(a, t, e);
}
const c = {
  apiVersion: 2,
  apiVersionMinor: 0
};
async function d(t, {
  allowedAuthMethods: e = [],
  allowedCardNetworks: a = []
}) {
  const n = {
    ...c,
    allowedPaymentMethods: [
      {
        type: "CARD",
        parameters: {
          allowedAuthMethods: e,
          allowedCardNetworks: a
        }
      }
    ]
  };
  return t.isReadyToPay(n).then(function(o) {
    if (o.result)
      return t;
  });
}
function h({
  merchantInfo: t,
  transactionInfo: e,
  allowedPaymentMethods: a = [],
  shippingAddressRequired: n = !1,
  shippingOptionRequired: o = !1
}) {
  const s = {
    ...c,
    merchantInfo: t,
    allowedPaymentMethods: a,
    transactionInfo: e,
    shippingAddressRequired: n,
    shippingOptionRequired: o,
    // TODO: 考虑是否该属性移到调用方手动追加？
    callbackIntents: ["PAYMENT_AUTHORIZATION"]
  };
  return n && s.callbackIntents.push("SHIPPING_ADDRESS"), o && s.callbackIntents.push("SHIPPING_OPTION"), s;
}
class g {
  constructor(e = "PRODUCTION") {
    this.environment = e, this.handleGooglePageBack.bind(this);
  }
  cbHolder = new u();
  getClient(e) {
    return new google.payments.api.PaymentsClient({
      environment: this.environment,
      paymentDataCallbacks: {
        onPaymentDataChanged: this.cbHolder.getPaymentDataCallback(e),
        onPaymentAuthorized: (...a) => this.cbHolder.paymentAuthorizedHandler?.(...a)
      }
    });
  }
  handleGooglePageBack() {
    const e = window.performance?.navigation?.type === window?.PerformanceNavigation?.TYPE_BACK_FORWARD, a = !0;
    this.getIsExecuting() && e && a && this.cbHolder?.backFromGoogleAuthHandler?.();
  }
  setIsExecuting(e = !1) {
    e ? (sessionStorage.setItem("google_pay_is_executing", "1"), window.addEventListener("pageshow", this.handleGooglePageBack)) : (sessionStorage.removeItem("google_pay_is_executing"), window.removeEventListener("pageshow", this.handleGooglePageBack));
  }
  getIsExecuting() {
    return !!sessionStorage.getItem("google_pay_is_executing");
  }
  // request google pay token
  async doAuthorize(e) {
    const a = h(e), n = this.getClient(a);
    if (!n)
      throw r(i.Uninitialized);
    const o = a?.allowedPaymentMethods?.[0]?.parameters;
    if (!o)
      throw r(i.InvalidPaymentDataRequest);
    await d(n, o).catch((s) => {
      throw r(i.NoSupport, s);
    }), this.setIsExecuting(!0);
    try {
      return n.loadPaymentData(a);
    } catch (s) {
      throw s;
    } finally {
      this.setIsExecuting(!1);
    }
  }
  getCallbackHolder() {
    return this.cbHolder;
  }
}
function m(t) {
  return [
    "onPaymentDataChanged",
    "onBackFromGoogleAuth",
    "onPaymentAuthorized"
  ].reduce((a, n) => (a[n] = t[n], a), {});
}
function y(t) {
  const e = new g(t), a = e.getCallbackHolder(), { doAuthorize: n } = e;
  return {
    doAuthorize: n,
    ...m(a)
  };
}
export {
  y as useGooglePay
};
