const express =require("express");
const router =express.Router();
const validateAccessToken = require("../middleware/validateAccessToken");
const validateRefreshToken = require("../middleware/validateRefreshToken");

const {
    loginContractor,
    logoutContractor,
    currentContractor,
    requestNewAccessToken,
} = require("../controllers/contractController");


router.post("/login",loginContractor);

router.get("/logout",logoutContractor);

router.get("/currentuser",validateAccessToken,currentContractor);

router.get("/refresh",validateRefreshToken,requestNewAccessToken);


module.exports =router;