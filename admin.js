require("dotenv").config();

const AdminJS = require("adminjs");
const AdminJSExpress = require("@adminjs/express");
const express = require("express");
const { Database, Resource } = require("@adminjs/prisma");
const PORT = process.env.port || 3010;
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
              show:{
                showInDrawer:true,
              },
              edit:{
                showInDrawer:true,
              },
              new:{
                showInDrawer:true,
              },
              sendmessage:{
                name:'sendmessage',
                actionType: 'record',
                isVisible: true,
                icon:'Edit',
                handler: async(request, response, data) => {
                  const { record, resource, currentAdmin, h, translateMessage } = data;
                  console.log(record.params);
  
                  return {
                    record: record.toJSON(currentAdmin),
                    redirectUrl: h.resourceUrl({ resourceId: resource._decorated?.id() || resource.id() }),
                    notice: {
                      message: translateMessage('successfullySendMessage', resource.id()),
                      type: 'success',
                    },
                  }
                },
                component: false,
              }
            }
          },
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
  app.use("/api", apiRouter);
  app.listen(PORT, () => {
      console.log(`Example app listening at http://localhost:${PORT}`);
  });
};
run().finally(async () => {
  await prisma.$disconnect();
});
