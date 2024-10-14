import express from "express";
import initAuthRoutes from "./routes/AuthRoutes";
import initUserRoutes from "./routes/UserRoutes";
import initRDoctoroutes from "./routes/DoctorRoutes";
import initSpecialtyRoutes from "./routes/SpecialtyRoutes";
import initClinicRoutes from "./routes/ClinicRoutes";
import initAllcodeRoutes from "./routes/AllcodeRoutes";
import connectDB from "./config/connectDB";
import cors from "cors";
import path from "path";


require("dotenv").config();

import bodyParser from "body-parser";
//để lấy các tham số bên Client gửi lên: query, params, body
let app = express();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(cors({ origin: true }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

//config app
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//init all web routes
initAuthRoutes(app);
initUserRoutes(app);
initRDoctoroutes(app);
initSpecialtyRoutes(app);
initClinicRoutes(app);
initAllcodeRoutes(app);

//connect to DB
connectDB();

let PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Backend is running on port ${PORT}`);
});