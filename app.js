const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

require('dotenv').config()

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors());

app.use('/flight', (req, res, next) => {
    axios.get(req.query.url)
    .then(response => {
        return res.status(200).send(
            `${response.data}`
        )
    })
    .catch(error => {
        console.log(error)
        return res.status(404).json({
            message: 'Błąd pobierania danych'
        })
    })

})

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;