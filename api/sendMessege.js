import { buildErrorDto, NaverMessageSendError } from "./error";
import { naverMessageService } from "./NaverMessageService";

const { prisma } = require("../admin");

export async function sendMessageController(req, res) {
  const { id } = req.params;

  // 1. 예외처리
  if (typeof id !== "number") {
    return res.status(400).send("");
  }
  if (typeof phoneNumber !== "string") {
    return res.status(400).send("");
  }

  // 2. 서비스 사용
  try {
    await sendMessageService(id);
  } catch (err) {
    // 1. 네이버 API 문자 전송 실패
    if (err instanceof NaverMessageSendError) {
      res.status(500).send(err.toDto(500));
    }
    // 2. 해당하는 콜이 없는경우
    
    // 3. 그 외...
    res.status(500).send(buildErrorDto(500, err));
  }
}

async function sendMessageService(id) {
  // 1. 해당 콜 건을 DB 에서 가져온다.
  let call;
  try {
    call = await prisma.call.findUnique({
      where: {
        id,
      },
    });
  } catch (err) {
    console.error("🚀 ~ file: sendMessege.js ~ line 39 ~ sendMessageService ~ err", err)
    // TODO: 1. 해당하는 id 없을때의 에러

    // TODO: 2. 그 외 에러는 그대로 throw
    throw err;
  }

  // 2. 해당 콜 건을 메세지를 보낸다.
  const url = naverMessageService.buildUrl(call.id);
  console.log("🚀 ~ file: sendMessege.js ~ line 45 ~ sendMessageService ~ url", url)
  const content = naverMessageService.buildContent(url);
  console.log("🚀 ~ file: sendMessege.js ~ line 47 ~ sendMessageService ~ content", content)

  let result;
  try {
    result = naverMessageService.sendMessage(content, call.phoneNumber);
  }
  catch(err) {
    console.log("🚀 ~ file: sendMessege.js ~ line 53 ~ sendMessageService ~ err", err)
    throw new NaverMessageSendError(err.message);
  }
  return result;
}