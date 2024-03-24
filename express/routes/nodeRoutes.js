const express =require("express");
const router =express.Router();
const validateAccessToken = require("../middleware/validateAccessToken");
const validateRefreshToken = require("../middleware/validateRefreshToken");

const {
    keepAlive,getAllNodes
} = require("../controllers/nodeController");


router.post("/keepalive",keepAlive);
router.get("/all",getAllNodes);

module.exports =router;