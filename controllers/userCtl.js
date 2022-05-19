const connection = require('../dbConfig')

const userCtl = {
  getUsers : async (req,res)=>{
      connection.query('SELECT * FROM user;', (error, rows)=>{
        if(error) throw error;
        res.send(rows);
      })
  },
  insertUser : async (req,res) =>{
    //javascript 구조분해할당
    const {userId, phone, userNm} = req.body;
    const sql = `INSERT INTO user(userId,phone,userNm)
                  VALUES (${userId},${phone},${userNm});`

    connection.query(
      sql,(error,rows)=>{
        if(error) throw error;
        res.send(rows);
      }
    )
  }
}

module.exports = userCtl
