/*
 * @author David Menger
 */
'use strict';

const assert = require('assert');
const Rule = require('../src/Rule');

const PATH = 'path';

describe('Rule', function () {

    it('should validate presence of required value', function () {
        const r = new Rule(PATH, true, false);

        assert.throws(() => r._validate(undefined));
        assert.throws(() => r._validate(null));

        assert.strictEqual(r._validate(false), false);
        assert.strictEqual(r._validate(true), true);
        assert.strictEqual(r._validate('false'), 'false');
        assert.strictEqual(r._validate('true'), 'true');
        assert.strictEqual(r._validate(0), 0);
        assert.strictEqual(r._validate(1), 1);
        assert.strictEqual(r._validate(''), '');
        assert.strictEqual(r._validate('text'), 'text');
    });

    it('should throw out empty values when set', function () {
        const r = new Rule(PATH, true, false);

        r.notEmpty();

        assert.throws(() => r._validate(undefined));
        assert.throws(() => r._validate(null));
        assert.throws(() => r._validate(''));
        assert.throws(() => r._validate(0));
        assert.throws(() => r._validate(false));

        assert.strictEqual(r._validate(true), true);
        assert.strictEqual(r._validate('false'), 'false');
        assert.strictEqual(r._validate('true'), 'true');
        assert.strictEqual(r._validate(1), 1);
        assert.strictEqual(r._validate('text'), 'text');
    });

    it('should validate presence of nullable value', function () {
        const r = new Rule(PATH, true, true);

        assert.throws(() => r._validate(undefined));

        assert.strictEqual(r._validate(null), null);
        assert.strictEqual(r._validate(false), false);
        assert.strictEqual(r._validate(true), true);
        assert.strictEqual(r._validate('false'), 'false');
        assert.strictEqual(r._validate('true'), 'true');
        assert.strictEqual(r._validate(0), 0);
        assert.strictEqual(r._validate(1), 1);
        assert.strictEqual(r._validate(''), '');
        assert.strictEqual(r._validate('text'), 'text');
    });

    it('should validate presence of optional value', function () {
        const r = new Rule(PATH, false, false);

        assert.throws(() => r._validate(null));

        assert.strictEqual(r._validate(undefined), undefined);
        assert.strictEqual(r._validate(false), false);
        assert.strictEqual(r._validate(true), true);
        assert.strictEqual(r._validate('false'), 'false');
        assert.strictEqual(r._validate('true'), 'true');
        assert.strictEqual(r._validate(0), 0);
        assert.strictEqual(r._validate(1), 1);
        assert.strictEqual(r._validate(''), '');
        assert.strictEqual(r._validate('text'), 'text');
    });

    it('should validate presence of optional value', function () {
        const r = new Rule(PATH, false, true);

        assert.strictEqual(r._validate(null), null);
        assert.strictEqual(r._validate(undefined), null);
        assert.strictEqual(r._validate(false), false);
        assert.strictEqual(r._validate(true), true);
        assert.strictEqual(r._validate('false'), 'false');
        assert.strictEqual(r._validate('true'), 'true');
        assert.strictEqual(r._validate(0), 0);
        assert.strictEqual(r._validate(1), 1);
        assert.strictEqual(r._validate(''), '');
        assert.strictEqual(r._validate('text'), 'text');
    });

    it('should filter strings', function () {
        const r = new Rule(PATH, false, true);

        r.string();

        assert.strictEqual(r._validate(null), null);
        assert.strictEqual(r._validate(undefined), null);
        assert.strictEqual(r._validate(false), 'false');
        assert.strictEqual(r._validate(true), 'true');
        assert.strictEqual(r._validate('false'), 'false');
        assert.strictEqual(r._validate('true'), 'true');
        assert.strictEqual(r._validate('0'), '0');
        assert.strictEqual(r._validate('1'), '1');
        assert.strictEqual(r._validate(0), '0');
        assert.strictEqual(r._validate(1), '1');
        assert.strictEqual(r._validate(''), '');
        assert.strictEqual(r._validate('text'), 'text');
    });

    it('should filter numbers', function () {
        const r = new Rule(PATH, false, true);

        r.number();

        assert.throws(() => r._validate('false'));
        assert.throws(() => r._validate('true'));
        assert.throws(() => r._validate(true));
        assert.throws(() => r._validate(false));
        assert.throws(() => r._validate(''), '');
        assert.throws(() => r._validate('text'));

        assert.strictEqual(r._validate(null), null);
        assert.strictEqual(r._validate(undefined), null);
        assert.strictEqual(r._validate('0'), 0);
        assert.strictEqual(r._validate('1'), 1);
        assert.strictEqual(r._validate(0), 0);
        assert.strictEqual(r._validate(1), 1);
    });

    it('should filter booleans', function () {
        const r = new Rule(PATH, false, true);

        r.boolean();

        assert.strictEqual(r._validate(null), null);
        assert.strictEqual(r._validate(undefined), null);

        assert.strictEqual(r._validate(false), false);
        assert.strictEqual(r._validate(true), true);
        assert.strictEqual(r._validate('false'), false);
        assert.strictEqual(r._validate('true'), true);
        assert.strictEqual(r._validate('0'), false);
        assert.strictEqual(r._validate('1'), true);
        assert.strictEqual(r._validate(0), false);
        assert.strictEqual(r._validate(1), true);
        assert.strictEqual(r._validate(''), false);
        assert.strictEqual(r._validate('text'), true);
    });

});
