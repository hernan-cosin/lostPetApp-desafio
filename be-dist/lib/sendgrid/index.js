"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sgMail = void 0;
// import * as sgMail from "@sendgrid/mail";
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sgMail = require("@sendgrid/mail");
exports.sgMail = sgMail;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
