const express = require('express');
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");

const credentials = require("./middleware/credentials");

require("dotenv").config();

const pool = require("./database/database");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(credentials);

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use('/auth/user', require('./routes/authRoutes'));
app.use('/auth/contractor', require('./routes/authContractRoutes'));
app.use('/report', require('./routes/reportRoutes'));
app.use('/contract', require('./routes/contractRoutes'));
app.use('/node', require('./routes/nodeRoutes'));

app.listen(PORT, () => {
    console.log(`Server is running on port :${PORT}`);
})