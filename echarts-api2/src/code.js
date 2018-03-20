/**
 * 一般性code
 */
module.exports = {

  COMMON: {
    ARGS: [4001, 'need params'] //缺少必要参数
  },

  VERIFY: {
    PHONE: {
      INVALID: [1001, 'invalid phone number'], // 无效的手机号
      EXIST: [1002, 'exist phone number'], // 已注册的手机号
      UPDATE_STATUS: [1003, 'fail to update code status'], // 更新验证码状态失败
      SEND_FAIL: [2001, 'fail to send sms'], // 短信发送失败
      ERR_CODE: [2003, 'error sms code'], // 验证码错误
      NOT_SEND_CODE: [3001, 'no sms was sent to this phone number'], // 未给此手机号发送过验证码
    },
    EMAIL: {
      INVALID: [1021, 'invalid email'], // 无效的邮箱
      EXIST: [1022, 'exist email'], // 已注册的邮箱
      UPDATE_STATUS: [1023, 'fail to update code status'], //更新验证码状态失败
      SEND_FAIL: [2021, 'fail to send email'], //邮件发送失败
      ERR_CODE: [2023, 'error email code'], // 验证码错误
      NOT_SEND_CODE: [3021, 'no code was sent to this email'], //未给此邮箱发送过验证码
    },
  },

};