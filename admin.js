require("dotenv").config();

const AdminJS = require("adminjs");
const AdminJSExpress = require("@adminjs/express");
const express = require("express");
const { Database, Resource } = require("@adminjs/prisma");
const PORT = process.env.port || 3000;
const { apiRouter } = require("./api/router");
const { prisma } = require("./prisma");

AdminJS.registerAdapter({ Database, Resource });

const run = async () => {
  const app = express();
  // `_dmmf` contains necessary Model metadata. `PrismaClient` type doesn't have it included
  const dmmf = prisma._dmmf.modelMap;
  const adminJS = new AdminJS({
      databases :[prisma], //DB 연결
      rootPath : '/admin',
      resources : [
        {resource:{model:dmmf.auth, client:prisma},
          options:{}
        },

        {resource:{model:dmmf.call, client:prisma},
          options:{ //call에 send Message 액션 추가
            actions:{
              list, edit, new:{
                showInDrawer:true,
              },
              newAction:{
                name:'send Message',
                actionType: 'record',
                isVisible: true,
                icon:'Edit',
                handler: () => {},
                component: false,
              }
            }
          }
        },
        {resource:{model:dmmf.user, client:prisma},
          options:{}
        }
      ]
  });

  // const ADMIN = { //로그인 정보
  //     email : 'gooddrive@gmail.com',
  //     password : 'gooddrive'
  // }
  // const router = AdminJSExpress.buildAuthenticatedRouter(adminJS, {
  //     authenticate: async (email, password) => {
  //       if (ADMIN.password === password && ADMIN.email === email) {
  //         return ADMIN
  //       }
  //         return null
  //       },
  //     cookieName: 'adminJS',
  //     cookiePassword: 'testtest'
  //   }); 

  const router = AdminJSExpress.buildRouter(adminJS);
  app.use(adminJS.options.rootPath, router);
  app.listen(PORT, () => {
      console.log(`Example app listening at http://localhost:${PORT}`);
  });
};
run().finally(async () => {
  await prisma.$disconnect();
});
