/*
 * @author David Menger
 */
'use strict';

const traverse = require('./traverse');
const Rule = require('./Rule');

class Validator {

    constructor () {
        this.rules = [];
    }

    required (path) {
        const rule = new Rule(path, true);
        this.rules.push(rule);
        return rule;
    }

    optional (path) {
        const rule = new Rule(path, false);
        this.rules.push(rule);
        return rule;
    }

    nullable (path) {
        const rule = new Rule(path, false, true);
        this.rules.push(rule);
        return rule;
    }

    okay (data) {
        const ret = {};
        this.rules.forEach(rule => this._validateRule(rule, data, ret));
        return ret;
    }

    _validateRule (rule, data, ret) {
        traverse(rule._path, (value, key) => rule._validate(value, key), data, ret, '');
    }
}

module.exports = Validator;
