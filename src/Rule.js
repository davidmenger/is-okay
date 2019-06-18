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

    /**
     * Sets filter
     *
     * @returns {this}
     */
    string () {
        this._type = 'string';
        return this;
    }

    /**
     * Sets filter
     *
     * @returns {this}
     */
    number () {
        this._type = 'number';
        return this;
    }

    /**
     * Sets filter
     *
     * @returns {this}
     */
    boolean () {
        this._type = 'boolean';
        return this;
    }

    /**
     * Sets default value
     *
     * @param {*} defaultValue
     * @returns {this}
     */
    default (defaultValue) {
        this._defaultValue = defaultValue;
        return this;
    }

    array () {
        this._type = 'array';
        return this;
    }

    /**
     * Adds validator
     *
     * @param {string} message
     * @param {{value:any,key:string}:void} fn
     * @returns {this}
     */
    is (message, fn) {
        this._is.push({ message, fn });
        return this;
    }

    /**
     * Value should not be empty (not falsey)
     *
     * @returns {this}
     */
    notEmpty () {
        this._notEmpty = true;
        return this;
    }

    _filter (value, key) {
        if (value === undefined && !this._required) {
            return this._defaultValue;
        }

        if (value === null && this._nullable) {
            return null;
        }

        if (value === null) {
            throw new ValidationError(`${key} should not be null`);
        } else if (value === undefined) {
            throw new ValidationError(`${key} should not be undefined`);
        }

        if (!value && this._notEmpty) {
            throw new ValidationError(`${key} should not be empty`);
        }

        switch (this._type) {
            case 'array':
                if (!Array.isArray(value)) {
                    throw new ValidationError(`${key} should be an array`);
                }
                if (this._notEmpty && value.length === 0) {
                    throw new ValidationError(`${key} should not be an empty array`);
                }
                return value;
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
        // skip validation of missing required values
        if (key !== this._path
            && this._required
            && (value === undefined || value === null)) {

            return value;
        }

        // presence
        const val = this._filter(value, key);


        if (val === undefined) {
            return undefined;
        }

        if (val === null) {
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
