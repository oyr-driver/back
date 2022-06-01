const AdminJS = require("adminjs");
const AdminJSExpress = require("@adminjs/express");
const express = require("express");
const { Database, Resource } = require("@adminjs/prisma");
const {PrismaClient} = require("@prisma/client");
const PORT = process.env.port || 3000;
const prisma = new PrismaClient();
//export
AdminJS.registerAdapter({ Database, Resource });

const run = async () => {
  const app = express();
  // `_dmmf` contains necessary Model metadata. `PrismaClient` type doesn't have it included
  const dmmf = prisma._dmmf;
  console.log(prisma._dmmf.modelMap);
  const resources = Object.keys(dmmf.modelMap)
    .map((val, idx) => dmmf.modelMap[val])
    .map((model) => ({
      resource: { model, client: prisma },
      options: {},
    }));
  resources[1].options = {
    //call에 send Message 액션 추가
    actions: {
      newAction: {
        name: "Send Message",
        actionType: "record",
        isVisible: true,
        handler: async (req, res, data) => {
          if (!data.record) {
            throw new NotFoundError(
              [
                `Record of given id("${req.params.recordId}")could not be found`,
              ].join("\n"),
              "Action#handler"
            );
          }
          return {
            record: data.record.toJSON(data.currentAdmin),
          };
        },
      },
    },
  };
  console.log(resources[1].options.actions.newAction);
  const adminJS = new AdminJS({
    databases: [prisma], //DB 연결
    rootPath: "/admin",
    resources: { resources },
  });
  const ADMIN = {
    //로그인 정보
    email: "gooddrive@gmail.com",
    password: "gooddrive",
  };

  const router = AdminJSExpress.buildAuthenticatedRouter(adminJS, {
    authenticate: async (email, password) => {
      if (ADMIN.password === password && ADMIN.email === email) {
        return ADMIN;
      }
      return null;
    },
    cookieName: "adminJS",
    cookiePassword: "testtest",
  });

  //const router = AdminJSExpress.buildRouter(adminJS);
  app.use(adminJS.options.rootPath, router);
  app.use("/api", apiRouter);
  app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });
};
run().finally(async () => {
 await prisma.$disconnect();
});

