require('./utils/db');
const express = require('express');
const cors = require('cors');
const port = 2222;
const app = express();

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {

});


app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});