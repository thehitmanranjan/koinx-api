const express = require('express');
const bodyParser = require('body-parser');
const Ethereum = require('../models/ethereum');
const Transaction = require('../models/transaction');
const axios = require('axios').default;
require('dotenv').config();

//Declaring Express Router
const ethereumRouter = express.Router();
ethereumRouter.use(bodyParser.json());

ethereumRouter.route('/getCryptoDetails')
    .get((req, res, next) => {
        Transaction.find({ address: req.query.address })
            .then((tw) => {
                let count = Object.keys(tw).length;
                let sum = 0
                for (let i = 0; i < count; i++) {
                    sum = sum + tw[i].transact
                }
                //Fetching Lates Eteherum Value from database
                Ethereum.find({ }).sort({_id:-1}).limit(1)
                    .then((ans) => {
                        responseJson = {
                            "current_balance": sum,
                            "current_price": ans[0].price
                        }
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(responseJson);
                    }, (err) => next(err))
                    .catch((err) => next(err));
                //End
            }, (err) => next(err))
            .catch((err) => next(err));
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

module.exports = ethereumRouter;