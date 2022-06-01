const Axios = require("axios");
const { NAVER_SMS_BASE_URL } = require("./const");
const CryptoJS = require("crypto-js");

const {
  SERVICE_URL,
  FROM_PHONE_NUMBER,
  NCP_IAM_ACCESS_KEY,
  NCP_IAM_SECRET_KEY,
  NCP_SNS_SERVICE_ID,
} = process.env;
class NaverMessageService {
  ncpInstance = Axios.create({
    baseURL: this.buildSmsSendUrl(),
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  async sendMessage(content, phoneNumber) {
    const body = this.buildSendMessageBody(content, phoneNumber);
    const payload = JSON.stringify(body);
    const timestamp = Date.now();
    const signature = this.buildSignature(
      timestamp,
      NCP_IAM_ACCESS_KEY,
      NCP_IAM_SECRET_KEY
    );
    console.log(
      "🚀 ~ file: NaverMessageService.js ~ line 21 ~ NaverMessageService ~ sendMessage ~ signature",
      signature
    );

    let response;
    try {
      response = await this.ncpInstance.post("", payload, {
        headers: {
          "x-ncp-apigw-timestamp": timestamp,
          "x-ncp-iam-access-key": NCP_IAM_ACCESS_KEY,
          "x-ncp-apigw-signature-v2": signature,
        },
      });
    } catch (err) {
      const { data } = err.response;
      console.log(
        "🚀 ~ file: NaverMessageService.js ~ line 35 ~ NaverMessageService ~ sendMessage ~ data",
        data
      );
      throw err;
    }
    console.log("🚀 ~ file: NaverMessageService.js ~ line 53 ~ NaverMessageService ~ sendMessage ~ response.data", response.data)
    return response.data;
  }

  buildSignature(timestamp, accessKey, secretKey) {
    var space = " "; // one space
    var newLine = "\n"; // new line
    var method = "POST"; // method
    var url = "/sms/v2/services/ncp:sms:kr:286374326793:goodde/messages";

    var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
    hmac.update(method);
    hmac.update(space);
    hmac.update(url);
    hmac.update(newLine);
    hmac.update(timestamp.toString());
    hmac.update(newLine);
    hmac.update(accessKey);

    var hash = hmac.finalize();

    return hash.toString(CryptoJS.enc.Base64);
  }

  buildSendMessageBody(content, phoneNumber) {
    return {
      type: "SMS",
      contentType: "COMM",
      countryCode: "82",
      from: FROM_PHONE_NUMBER,
      content,
      messages: [
        {
          to: phoneNumber,
          content,
        },
      ],
    };
  }

  buildContent(url) {
    return `*대리운전 위치전송: ${url}`;
  }

  buildUrl(callId) {
    return `${SERVICE_URL}/l/${callId}`;
  }

  buildSmsSendUrl() {
    return `${NAVER_SMS_BASE_URL}/${this.buildSubPathUrl()}`;
  }

  buildSubPathUrl() {
    return `sms/v2/services/${NCP_SNS_SERVICE_ID}/messages`;
  }
}
exports.naverMessageService = new NaverMessageService();
