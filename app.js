const express = require("express");
const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const AdminJSSequelize = require("@adminjs/sequelize");
const app = express();
const port = 3000;

AdminJS.registerAdapter(AdminJSSequelize);
const adminJS = new AdminJS({
    databases :[],
    rootPath : '/admin',
})
const router = AdminJSExpress.buildRouter(adminJS);

app.use(adminJS.options.rootPath, router);
app.listen(port,()=>{
    console.log(`listening at http://localhost:${port}`);
});