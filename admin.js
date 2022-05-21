import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import express from "express";
import { Database, Resource } from "@adminjs/prisma";
import { PrismaClient } from "@prisma/client";
const PORT = process.env.port || 3000;
//const prisma = new PrismaClient();
const prisma = new PrismaClient({ datasources: {  db: { url: "mysql://root:0000@localhost:3306/gooddrive" } } });
AdminJS.registerAdapter({ Database, Resource });

const run = async () => {
    const app = express();
    // `_dmmf` contains necessary Model metadata. `PrismaClient` type doesn't have it included
    const dmmf = (prisma)._dmmf;
    const resources = Object.keys(dmmf.modelMap)
        .map((val, idx) => dmmf.modelMap[val])
        .map((model) => ({
        resource: { model, client: prisma },
        options: {},
         }));
    const adminJS = new AdminJS({
        databases :[prisma], //DB 연결
        rootPath : '/admin',
        resources : {resources}
    });
    const ADMIN = { //로그인 정보
        email : 'gooddrive@gmail.com',
        password : 'gooddrive'
    }
    const router = AdminJSExpress.buildAuthenticatedRouter(adminJS, {
        authenticate: async (email, password) => {
          if (ADMIN.password === password && ADMIN.email === email) {
            return ADMIN
          }
            return null
          },
        cookieName: 'adminJS',
        cookiePassword: 'testtest'
      }); 
    app.use(adminJS.options.rootPath, router);
    app.listen(PORT, () => {
        console.log(`Example app listening at http://localhost:${PORT}`);
    });
};
run().finally(async () => {
 await prisma.$disconnect();
});

/*
const app = express();
const adminJS = new AdminJS({
    databases :[prisma], //DB 연결
    rootPath : '/admin',
});

//const router = AdminJSExpress.buildRouter(adminJS);
const ADMIN = { //로그인 정보
    email : 'gooddrive@gmail.com',
    password : 'gooddrive'
}
const router = AdminJSExpress.buildAuthenticatedRouter(adminJS, {
    authenticate: async (email, password) => {
      if (ADMIN.password === password && ADMIN.email === email) {
        return ADMIN
      }
        return null
      },
    cookieName: 'adminJS',
    cookiePassword: 'testtest'
  }); 

app.use(adminJS.options.rootPath, router);
app.listen(PORT,()=>{
    console.log(`listening at http://localhost:${PORT}`);
});
*/