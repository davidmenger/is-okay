/*
 * @author David Menger
 */
'use strict';

const ValidationError = require('./src/ValidationError');
const traverse = require('./src/traverse');
const Rule = require('./src/Rule');

/**
 * @typedef {Error} ValidationError
 * @prop {string} invalidKey
 * @prop {number} status
 * @prop {number} statusCode
 */

class Validator {

    constructor () {
        this.rules = [];
    }

    /**
     *
     * @param {string} path
     * @returns {Rule}
     */
    required (path) {
        const rule = new Rule(path, true);
        this.rules.push(rule);
        return rule;
    }

    /**
     *
     * @param {string} path
     * @returns {Rule}
     */
    optional (path) {
        const rule = new Rule(path, false);
        this.rules.push(rule);
        return rule;
    }

    /**
     *
     * @param {string} path
     * @returns {Rule}
     */
    nullable (path) {
        const rule = new Rule(path, false, true);
        this.rules.push(rule);
        return rule;
    }

    /**
     *
     * @template T
     * @param {T:Object} data
     * @param {boolean} makeRootOptional - make all root attributes optional (usefull for updates)
     * @returns {T}
     * @throws {ValidationError}
     */
    okay (data, makeRootOptional = false) {
        const ret = {};
        this.rules.forEach(rule => this._validateRule(rule, data, ret, makeRootOptional));
        return ret;
    }

    _validateRule (rule, data, ret, makeRootOptional) {
        traverse(rule._path, (value, key) => rule._validate(value, key, makeRootOptional), data, ret, '');
    }
}

function isOkay () {
    return new Validator();
}

isOkay.ValidationError = ValidationError;
isOkay.Validator = Validator;

module.exports = isOkay;
