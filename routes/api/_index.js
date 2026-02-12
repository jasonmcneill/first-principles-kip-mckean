const express = require('express');
const router = express.Router();
const utils = require('./utils');
const authenticateToken = utils.authenticateToken;

// REGISTRATION & AUTHENTICATION ROUTES

const register = require('./register');
router.post('/register', register.POST);

const confirm = require('./confirm');
router.post('/confirm', confirm.POST);

const login = require('./login');
router.post('/login', login.POST);

const refreshToken = require('./refresh-token');
router.post('/refresh-token', refreshToken.POST);

const pending = require('./pending');
router.post('/pending', authenticateToken, pending.POST);

const pwForgot = require('./pw-forgot');
router.post('/pw-forgot', pwForgot.POST);

const pwForgotConfirm = require('./pw-forgot-confirm');
router.post('/pw-forgot-confirm', pwForgotConfirm.POST);

const pwForgotNew = require('./pw-forgot-new');
router.post('/pw-forgot-new', authenticateToken, pwForgotNew.POST);

// SUBSCRIPTION ROUTES

// When onApprove fires in the client after a successful subscription purchase
const verifySubscription = require('./verify-subscription');
router.post('/verify-subscription', authenticateToken, verifySubscription.POST);

// PayPal Webhook to handle subscription events
const paypalWebhook = require('./paypal-webhook');
router.post('/paypal-webhook', paypalWebhook.POST);

// Check subscription status continuously in the client
const checkSubscription = require('./check-subscription');
router.post('/check-subscription', authenticateToken, checkSubscription.POST);

// ACCOUNT

const accountGet = require('./account-get');
router.post('/account-get', authenticateToken, accountGet.POST);

const accountUpdate = require('./account-update');
router.post('/account-update', authenticateToken, accountUpdate.POST);

module.exports = router;
