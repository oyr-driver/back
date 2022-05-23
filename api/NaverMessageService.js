const Axios = require('axios');
const { NAVER_SMS_URL } = require('../const');
const hmacSHA256 = require('crypto-js/hmac-sha256');

const { SERVICE_URL, NCP_IAM_ACCESS_KEY, NCP_IAM_SECRET_KEY }  = process.env;

class NaverMessageService {
  ncpInstance = Axios.create({
    baseURL: NAVER_SMS_URL,
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  sendMessage(content, phoneNumber) {
    const body = this.buildSendMessageBody(content, phoneNumber);
    const payload = JSON.stringify(body);
    const signature = this.buildSignature(payload, NCP_IAM_SECRET_KEY);
    console.log("🚀 ~ file: NaverMessageService.js ~ line 21 ~ NaverMessageService ~ sendMessage ~ signature", signature)
    const response = await this.ncpInstance.post("/", payload, {
      headers: {
        "x-ncp-apigw-timestamp": Date.now(),
        "x-ncp-iam-access-key	": NCP_IAM_ACCESS_KEY,
        "x-ncp-apigw-signature-v2": signature,
      },
    });
    console.log("🚀 ~ file: NaverMessageService.js ~ line 29 ~ NaverMessageService ~ sendMessage ~ response", response)
    return response.data;
  }

  buildSignature(payload, secretKey) {
    return hmacSHA256(payload, secretKey).toString();
  }

  buildSendMessageBody(content, phoneNumber) {
    return {
      type: "SMS",
      contentType: "COMM",
      countryCode: "82",
      from: "string",
      content,
      messages: [
        {
          to: phoneNumber,
          content,
        },
      ]
    };
  }

  buildContent(url) {
    return `안녕하세요. 굳드(good driver)입니다.
    링크에 접속해서 현재 위치를 기사에게 알려주세요.
    (${url})`;
  }

  buildUrl(callId) {
    return `${SERVICE_URL}/l/${callId}`;
  }
};
export const naverMessageService = new NaverMessageService();