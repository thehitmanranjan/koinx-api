const express = require('express');
const bodyParser = require('body-parser');
const Transaction = require('../models/transaction');
const axios = require('axios').default;
require('dotenv').config();

//Declaring Express Router
const transactionsRouter = express.Router();
transactionsRouter.use(bodyParser.json());

transactionsRouter.route('/showTransactions')
    .get((req, res, next) => {
        const url = "https://api.etherscan.io/api?module=account&action=txlist&address=" + req.query.address + "&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=" + process.env.API_KEY
        axios.get(url)
            .then(function (response) {
                // handle success
                let data = response.data
                let currentTrnx
                let index = 0
                let trnxArray = []
                let responseJson
                for (let trnx in data.result) {
                    if (data.result[trnx].to == req.query.address) {
                        currentTrnx = parseInt("+" + data.result[trnx].value)
                    }
                    else {
                        currentTrnx = parseInt("-" + data.result[trnx].value)
                    }
                    trnxArray.push(currentTrnx)
                    var tranxDetails = new Transaction({
                        address: req.query.address,
                        transact: currentTrnx
                    });

                    tranxDetails.save((err, doc) => {
                        if (!err) {
                            console.log("Saved transaction with no error")
                        }
                        else {
                            console.log('Error during transaction insertion : ' + err);
                        }
                    });

                    index = index + 1
                }
                responseJson = {
                    "address": req.query.address,
                    "transactions": trnxArray
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(responseJson);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /favorites');
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })
    .delete((req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE operation not supported on /favorites');
    });

module.exports = transactionsRouter;