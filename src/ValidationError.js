/*
 * @author David Menger
 */
'use strict';

class ValidationError extends Error {

    constructor (err, invalidKey) {
        super(err);

        this.invalidKey = invalidKey;

        this.status = ValidationError.status;

        this.statusCode = ValidationError.status;
    }
}

ValidationError.status = 400;

module.exports = ValidationError;
