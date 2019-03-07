# OsOkay Validator

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