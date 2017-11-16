/*
 * @author David Menger
 */
'use strict';

const Validator = require('./src/Validator');
const ValidationError = require('./src/ValidationError');

function isOkay () {
    return new Validator();
}

isOkay.ValidationError = ValidationError;
isOkay.Validator = Validator;

module.exports = isOkay;
