export class CallbackHolder {
  constructor() {
    this.onBackFromGoogleAuth = this.onBackFromGoogleAuth.bind(this);
  }
  // 从谷歌账户授权登录页返回到商城时触发
  backFromGoogleAuthHandler: () => void;

  onBackFromGoogleAuth(cb: () => void) {
    if (typeof cb === 'function') {
      this.backFromGoogleAuthHandler = cb;
    }
  }
}
