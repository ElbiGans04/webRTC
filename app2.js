const path = require("path");
const express = require('express');
const app = express();

app.use('/assest', express.static('./public'));
app.get('/', (req,res) => {
    const location = path.resolve(path.join(__dirname, '/index2.html'));
    res.sendFile(location)
});

app.listen(3001);