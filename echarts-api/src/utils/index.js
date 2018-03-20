import CryptoJS from 'crypto-js'

export const plainObj = (model) => {
  return JSON.parse(JSON.stringify(model))
};

export const TYPE = {
  PHONE: 'phone',
  EMAIL: 'email',
};

export const getReqTypeInfo = ({ email, phone, code }) => {
  let type, name;

  if (phone !== undefined) {
    type = TYPE.PHONE;
    name = phone;
  } else if (email !== undefined) {
    type = TYPE.EMAIL;
    name = email;
  } else {
    return null
  }

  return {
    code,
    type,
    name,
    TYPE_NAME: type.toUpperCase(),
  }
};

export const getTokenCB = (ctx) => {
  const host = ctx.request.host
  if (host.match(/^api/)) {
    return `https://${host.replace(/^api./, '')}/result`
  } else {
    return `http://${host.replace(/3002/, '3001')}/result`
  }
};

export const getCodeParams = ([code = 0, msg = 'SUCCESS'] = []) => {
  return `?code=${code}&msg=${msg}`
};


/**
 * 编码
 * @param str
 * @constructor
 */
export const BASE64_ENCODE = (str) => {
  const wordArray = CryptoJS.enc.Utf8.parse(str);
  const base64 = CryptoJS.enc.Base64.stringify(wordArray);
  // console.log('encrypted:', base64);
  return base64
};

/**
 * 解码
 * @param base64
 * @constructor
 */
export const BASE64_DECODE = (base64) => {
  const parsedWordArray = CryptoJS.enc.Base64.parse(base64);
  const parsedStr = parsedWordArray.toString(CryptoJS.enc.Utf8);
  // console.log("parsed:", parsedStr);
  return parsedStr;
}
