import { apiStatus } from '../../../lib/util';
import { Router } from 'express';
import request from 'request';
const Magento2Client = require('magento2-rest-client').Magento2Client

module.exports = ({ config, db }) => {
  let api = Router();
  var braintree = require('braintree');
  let env = config.extensions.braintree.mode === 'sandbox' ? braintree.Environment.Sandbox : braintree.Environment.Production

  api.get('/get-token', (req, res) => {
    var gateway = new braintree.BraintreeGateway({
      environment: env,
      merchantId: config.extensions.braintree.merchantId,
      publicKey: config.extensions.braintree.publicKey,
      privateKey: config.extensions.braintree.privateKey
    });

    gateway.clientToken.generate({})
    .then(response => {
      var clientToken = response.clientToken
      apiStatus(res, {
        token: clientToken,
        status: 'success'
      }, 200);
    }).catch(err => {
      apiStatus(res,err, 500);
      console.error(err)
    });
  });

  api.post('/do-payment', (req, res) => {
    var reqB = req.body;
    console.log(reqB)
    console.log(reqB.nonce)
    var gateway = new braintree.BraintreeGateway({
      environment: env,
      merchantId: config.extensions.braintree.merchantId,
      publicKey: config.extensions.braintree.publicKey,
      privateKey: config.extensions.braintree.privateKey
    });

    gateway.transaction.sale({
      amount: reqB.total,
      paymentMethodNonce: reqB.nonce,
      options: {
        submitForSettlement: true
      }
    })
    .then(response => {
      console.debug(response)
      if (typeof (response.success) !== 'undefined') {
        if (response.success) {
          apiStatus(res, {
            status: response.transaction.status,
            result: response,
            error: false
          }, 200);
        } else {
          apiStatus(res, {
            error: response.errors.deepErrors()
          }, 500);
        }
      } else {
        apiStatus(res, {
          error: response.ErrorResponse.params.message
        }, 500);
      }
    }).catch(err => {
      console.error(err);
      apiStatus(res, err, 500);
    });
  });

  return api
}
