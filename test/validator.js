/*
 * @author David Menger
 */
'use strict';

const assert = require('assert');
const { Validator } = require('../main');

describe('Validator', function () {

    it('has optional nested values', () => {
        const v = new Validator();

        v.optional('opt');
        v.required('opt.req').string();

        assert.deepEqual(v.okay({
            notHere: 2
        }), {});

        assert.throws(() => {
            v.okay({
                opt: {}
            });
        });

        assert.deepEqual(v.okay({
            notHere: 2,
            opt: { req: 'a' }
        }), { opt: { req: 'a' } });
    });

    it('has nullable nested values', () => {
        const v = new Validator();

        v.nullable('opt');
        v.required('opt.req').string();

        assert.deepEqual(v.okay({
            notHere: 2
        }), { opt: null });

        assert.deepEqual(v.okay({
            opt: null
        }), { opt: null });

        assert.throws(() => {
            v.okay({
                opt: {}
            });
        });

        assert.deepEqual(v.okay({
            notHere: 2,
            opt: { req: 'a' }
        }), { opt: { req: 'a' } });
    });

    it('should add missing prop to array', function () {
        const v = new Validator();

        v.optional('array[].opt').default(1);
        v.required('strings').array();

        assert.deepEqual(v.okay({
            notHere: 2,
            array: [
                { notHere: 3 }
            ],
            strings: ['a']
        }), {
            array: [
                { opt: 1 }
            ],
            strings: ['a']
        });
    });

    it('should construct new object, when props are missing', function () {
        const v = new Validator();

        v.nullable('some.nested');
        v.nullable('array[].value')
            .string();
        v.optional('array[].opt')
            .default(1);
        v.optional('array[].notHere');
        v.required('array[].required')
            .string();
        v.required('required')
            .number();

        assert.deepEqual(v.okay({
            required: 1,
            notHere: 2,
            array: [
                { required: 'abv', removeMe: 4, value: null },
                { required: 'abc', out: 6, opt: 2 }
            ]
        }), {
            required: 1,
            some: { nested: null },
            array: [
                { required: 'abv', opt: 1, value: null },
                { required: 'abc', opt: 2, value: null }
            ]
        });
    });

});
