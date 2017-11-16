/*
 * @author David Menger
 */
'use strict';

const ValidationError = require('./ValidationError');

class Rule {
    constructor (path, required = false, nullable = false) {
        this._path = path;
        this._required = required;
        this._nullable = nullable;
        this._type = null;
        this._notEmpty = false;
        this._is = [];
        this._defaultValue = nullable ? null : undefined;
    }

    string () {
        this._type = 'string';
        return this;
    }

    number () {
        this._type = 'number';
        return this;
    }

    boolean () {
        this._type = 'boolean';
        return this;
    }

    default (defaultValue) {
        this._defaultValue = defaultValue;
        return this;
    }

    is (message, fn) {
        this._is.push({ message, fn });
        return this;
    }

    notEmpty () {
        this._notEmpty = true;
        return this;
    }

    _filter (value, key) {
        if (value === undefined && !this._required) {
            return this._defaultValue;
        } else if (value === null && this._nullable) {
            return null;
        } else if (value === null) {
            throw new ValidationError(`${key} should not be null`);
        } else if (value === undefined) {
            throw new ValidationError(`${key} should not be undefined`);
        }

        if (!value && this._notEmpty) {
            throw new ValidationError(`${key} should not be empty`);
        }

        switch (this._type) {
            case 'string':
                if (typeof value !== 'string') {
                    return `${value}`;
                }
                return value;
            case 'number': {
                let val;
                if (typeof val !== 'number') {
                    val = parseInt(value, 10);
                }
                if (Number.isNaN(val)) {
                    throw new ValidationError(`${key} should be a number`);
                }
                return val;
            }
            case 'boolean':
                if (value === 'false' || value === '0' || value === 0) {
                    return false;
                }
                return !!value;
            default:
                return value;
        }
    }

    _validate (value, key) {
        // presence
        const val = this._filter(value, key);

        if (val === undefined) {
            return undefined;
        } else if (val === null) {
            return null;
        }

        this._is.forEach(({ message, fn }) => {
            if (!fn(val, key)) {
                throw new ValidationError(message, key);
            }
        });

        return val;
    }
}

module.exports = Rule;
