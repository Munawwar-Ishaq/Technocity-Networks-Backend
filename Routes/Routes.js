const express = require("express");
const LoginController = require("../Controllers/LoginController");
const GetAdminInfoController = require("../Controllers/GetAdminInfoController");
const AuthMiddleware = require("../Middleware/auth");
const CreateAccountController = require("../Controllers/CreateAccountController");
const UpdateAdminController = require("../Controllers/UpdateAdminController");
const AddAreaController = require("../Controllers/AddAreaController");
const GetFormDataController = require("../Controllers/GetFormDataController");
const AddUserController = require("../Controllers/AddUserController");
const GetUserController = require("../Controllers/GetUserController");
const UserCountController = require("../Controllers/UserCountController");
const GetEditUserInfoController = require("../Controllers/GetEditUserInfoController");
const EditUserController = require("../Controllers/EditUserController");
const DeleteUserController = require("../Controllers/DeleteUserController");
const SearchUserController = require("../Controllers/SearchUserController");
const UploadFileController = require("../Controllers/UploadFileController");
const FilterUserController = require("../Controllers/FilterUserController");
const AddPackageController = require("../Controllers/AddPackageController");
const DashboardDataController = require("../Controllers/DashboardDataController");
const GetUserDetailController = require("../Controllers/GetUserDetailController");
const GetDeactiveUserController = require("../Controllers/GetDeactiveUserController");

const Routes = express.Router();

// All API Routes Start

Routes.post("/create-account", CreateAccountController);
Routes.post("/login", LoginController);
Routes.post("/get-admin-info", AuthMiddleware, GetAdminInfoController);
Routes.post("/update-admin-info", AuthMiddleware, UpdateAdminController);
Routes.post("/add-area", AuthMiddleware, AddAreaController);
Routes.post("/add-package", AuthMiddleware, AddPackageController);
Routes.get("/get-form-data", AuthMiddleware, GetFormDataController);
Routes.post("/add/user", AuthMiddleware, AddUserController);
Routes.get("/get/user", AuthMiddleware, GetUserController);
Routes.get("/get/user/deactive", AuthMiddleware, GetDeactiveUserController);
Routes.get("/get/user-detail", AuthMiddleware, GetUserDetailController);
Routes.get("/user/count", AuthMiddleware, UserCountController);
Routes.get("/get/userInfo/edit", AuthMiddleware, GetEditUserInfoController);
Routes.get("/user/search", AuthMiddleware, SearchUserController);
Routes.delete("/user/delete/:userId", AuthMiddleware, DeleteUserController);
Routes.post("/user/edit", AuthMiddleware, EditUserController);
Routes.post("/user/upload-file", AuthMiddleware, UploadFileController);
Routes.get("/user/filter", AuthMiddleware, FilterUserController);
Routes.get("/dashboard/data", AuthMiddleware, DashboardDataController);

// Api Routes End

module.exports = Routes;
