const express =require("express");

const router =express.Router();
const validateAccessToken = require("../middleware/validateAccessToken");
const validateRefreshToken = require("../middleware/validateRefreshToken");

const {
    loginUser,
    logoutUser,
    currentUser,
    requestNewRefreshToken,
} = require("../controllers/authController");


router.post("/login",loginUser);

router.get("/logout",logoutUser);

router.get("/currentuser",validateAccessToken,currentUser);

router.get("/refresh",validateRefreshToken,requestNewRefreshToken);


module.exports =router;