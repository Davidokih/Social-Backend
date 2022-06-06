require('./utils/db');
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 2222;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: "connected successfuly"
    });
});


app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});