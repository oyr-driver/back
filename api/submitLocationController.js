const { CalculatorCheck } = require('@carbon/icons-react');
const { LetterCc } = require('@carbon/icons-react');
const { prisma } = require('../prisma');
const { CallStatusDict } = require('./dict');

exports.submitLocationController = async function (req, res) {
  let { id } = req.params;
  console.log("🚀 ~ file: submitLocationController.js ~ line 6 ~ submitLocationController ~ id", id)
  const { lat, lon, addr } = req.body;
  console.log("🚀 ~ file: submitLocationController.js ~ line 8 ~ submitLocationController ~ req.body", req.body)

  try {
    id = parseInt(id);
    if(isNaN(id)) {
      throw new Error();
    }
  }
  catch(err) {
    return res.status(400).send("id is not valid number");
  }

  let call;
  try {
    call = await prisma.call.findUnique({
      where: {
        seq: id,
      },
    });
  } catch (err) {
    console.error("🚀 ~ file: sendMessege.js ~ line 39 ~ sendMessageService ~ err", err)
    // TODO: 1. 해당하는 id 없을때의 에러

    // TODO: 2. 그 외 에러는 그대로 throw
    throw err;
  }

  call.status = CallStatusDict.LocationSubmit;
  call.sLat = lat;
  call.sLong = lon;
  call.sAddr = addr;
  
  console.log("🚀 ~ file: submitLocationController.js ~ line 27 ~ submitLocationController ~ call", call)

  try {
    await prisma.call.update({
      where: {
        seq: id,
      },
      data: call,
    });
  }
  catch(err) {
    throw err;
  }

  return res.status(200).send(call);
}