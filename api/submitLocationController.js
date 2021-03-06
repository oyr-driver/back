const { CalculatorCheck } = require('@carbon/icons-react');
const { LetterCc } = require('@carbon/icons-react');
const { prisma } = require('../prisma');
const { CallStatusDict } = require('./dict');

exports.submitLocationController = async function (req, res) {
  let { id } = req.params;
  console.log("π ~ file: submitLocationController.js ~ line 6 ~ submitLocationController ~ id", id)
  const { lat, lon, addr } = req.body;
  console.log("π ~ file: submitLocationController.js ~ line 8 ~ submitLocationController ~ req.body", req.body)

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
    console.error("π ~ file: sendMessege.js ~ line 39 ~ sendMessageService ~ err", err)
    // TODO: 1. ν΄λΉνλ id μμλμ μλ¬

    // TODO: 2. κ·Έ μΈ μλ¬λ κ·Έλλ‘ throw
    throw err;
  }

  call.status = CallStatusDict.LocationSubmit;
  call.sLat = lat;
  call.sLong = lon;
  call.sAddr = addr;
  
  console.log("π ~ file: submitLocationController.js ~ line 27 ~ submitLocationController ~ call", call)

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