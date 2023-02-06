class g {
  constructor() {
    this.onBackFromGoogleAuth = this.onBackFromGoogleAuth.bind(this);
  }
  // 从谷歌账户授权登录页返回到商城时触发
  backFromGoogleAuthHandler;
  onBackFromGoogleAuth(t) {
    typeof t == "function" && (this.backFromGoogleAuthHandler = t);
  }
}
var c = /* @__PURE__ */ ((e) => (e[e.NoSupport = 1] = "NoSupport", e[e.Timeout = 2] = "Timeout", e[e.MultipleInstances = 3] = "MultipleInstances", e[e.InvalidPaymentDataRequest = 4] = "InvalidPaymentDataRequest", e[e.Uninitialized = 5] = "Uninitialized", e[e.Developer = 6] = "Developer", e[e.InvalidAccount = 7] = "InvalidAccount", e[e.Other = 0] = "Other", e))(c || {});
class r extends Error {
  constructor(t, a, n) {
    super(t), this.type = a, this.orignal = n, this.isSDK = l(this.orignal);
  }
  isSDK;
}
function i(e, t) {
  let a = "";
  switch (e) {
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
    case 6:
      a = "Developer error, please check `orginal` property get more infomations.";
      break;
    case 7:
      a = "The current Google user is unable to provide payment information.";
      break;
    case 0:
    default:
      return t || new r("Unknown error", e);
  }
  return new r(a, e, t);
}
function h(e) {
  return l(e) ? e.statusCode === "CANCELED" && !e.statusMessage : e instanceof Error && e.message === "User closed the Payment Request UI.";
}
function d(e) {
  if (console.log("process error"), console.error(e), e instanceof r)
    return e;
  let t = 0;
  if (l(e))
    return e.statusCode === "DEVELOPER_ERROR" && (t = 6), i(t, e);
  if (e instanceof Error)
    switch (e.message) {
      case 'The "paymentrequest" event timed out after 5 minutes.':
        t = 2;
        break;
      case "This method can only be called one at a time.":
        t = 3;
        break;
    }
  return i(0, e);
}
function l(e) {
  return typeof e == "object" ? "statusCode" in e : !1;
}
const u = {
  apiVersion: 2,
  apiVersionMinor: 0
};
async function m(e, {
  allowedAuthMethods: t = [],
  allowedCardNetworks: a = []
}) {
  const n = {
    ...u,
    allowedPaymentMethods: [
      {
        type: "CARD",
        parameters: {
          allowedAuthMethods: t,
          allowedCardNetworks: a
        }
      }
    ]
  };
  return e.isReadyToPay(n).then(function(o) {
    if (o.result)
      return e;
  });
}
function f({
  merchantInfo: e,
  transactionInfo: t,
  allowedPaymentMethods: a = [],
  shippingAddressRequired: n = !1,
  shippingOptionRequired: o = !1
}) {
  const s = {
    ...u,
    merchantInfo: e,
    allowedPaymentMethods: a,
    transactionInfo: t,
    shippingAddressRequired: n,
    shippingOptionRequired: o,
    // TODO: 考虑是否该属性移到调用方手动追加？
    callbackIntents: ["PAYMENT_AUTHORIZATION"]
  };
  return n && s.callbackIntents.push("SHIPPING_ADDRESS"), o && s.callbackIntents.push("SHIPPING_OPTION"), s;
}
class P {
  constructor(t, a) {
    this.client = t, this.cbHolder = a, this.handleGooglePageBack = this.handleGooglePageBack.bind(this), window.addEventListener("unload", () => {
      this.setIsExecuting(!1);
    });
  }
  handleGooglePageBack() {
    const t = window.performance?.navigation?.type === window?.PerformanceNavigation?.TYPE_BACK_FORWARD, a = !0;
    this.getIsExecuting() && t && a && this.cbHolder?.backFromGoogleAuthHandler?.();
  }
  setIsExecuting(t = !1) {
    t ? (sessionStorage.setItem("google_pay_is_executing", "1"), window.addEventListener("pageshow", this.handleGooglePageBack)) : (sessionStorage.removeItem("google_pay_is_executing"), window.removeEventListener("pageshow", this.handleGooglePageBack));
  }
  getIsExecuting() {
    return !!sessionStorage.getItem("google_pay_is_executing");
  }
  async loadPaymentData(t) {
    const a = f(t);
    this.setIsExecuting(!0);
    try {
      const n = a?.allowedPaymentMethods?.[0]?.parameters;
      if (!n)
        throw i(c.InvalidPaymentDataRequest);
      return await m(this.client, n).catch((s) => {
        throw i(c.NoSupport, s);
      }), { data: await this.client.loadPaymentData(a), isCanceled: !1 };
    } catch (n) {
      if (h(n))
        return { isCanceled: !0 };
      throw d(n);
    } finally {
      this.setIsExecuting(!1);
    }
  }
  createButton(t) {
    return this.client.createButton(t);
  }
}
function y(e) {
  const t = new g(), { onBackFromGoogleAuth: a } = t;
  return {
    createClient(n = {}) {
      n.environment = n?.environment ?? e;
      const o = new google.payments.api.PaymentsClient(n);
      return new P(o, t);
    },
    onBackFromGoogleAuth: a
  };
}
export {
  y as useGooglePay
};
