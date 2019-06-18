# IsOkay Validator

## Simple

```javascript
const isOkay = require('is-okay');

const v = isOkay();

v.required('botId')
    .string()
    .is('not a reseved word [app]', b => b !== 'app')
    .is('max 47 chars long', b => b.length <= 47);

v.required('wingbotToken')
    .string();

v.optional('tier')
    .default('free')
    .is('one of allowed values', t => ['free', 'staging', 'production'].includes(t));

const data = v.okay(inputData);

```

## Validates nested objects

```javascript
const isOkay = require('is-okay');

const v = isOkay();

v.nullable('opt');
v.required('opt.req').string();

assert.deepEqual(v.okay({}), { opt: null });

assert.throws(() => {
    v.okay({
        opt: {}
    });
});

assert.deepEqual(v.okay({
    opt: { req: 'a' }
}), { opt: { req: 'a' } });

```

## Objects in arrays

```javascript
const isOkay = require('is-okay');

const v = isOkay();

v.nullable('some.nested');
v.nullable('array[].value');
v.optional('array[].opt').default(1);
v.optional('array[].notHere');
v.required('array[].required');
v.required('required');

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
        { required: 'abc', out: 6, opt: 1 }
    ]
}), {
    required: 1,
    some: { nested: null },
    array: [
        { required: 'abv', opt: 1, value: null },
        { required: 'abc', opt: 2, value: null }
    ]
});

```