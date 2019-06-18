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
-----------------

# API
## Classes

<dl>
<dt><a href="#Rule">Rule</a></dt>
<dd><p>{Rule} Validation configurator</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ValidationError">ValidationError</a> : <code>Error</code></dt>
<dd></dd>
<dt><a href="#validator">validator</a> : <code>function</code></dt>
<dd><p>Validator callback</p>
</dd>
</dl>

<a name="Rule"></a>

## Rule
{Rule} Validation configurator

**Kind**: global class  

* [Rule](#Rule)
    * [.string()](#Rule+string) ⇒ <code>this</code>
    * [.number()](#Rule+number) ⇒ <code>this</code>
    * [.boolean()](#Rule+boolean) ⇒ <code>this</code>
    * [.default(defaultValue)](#Rule+default) ⇒ <code>this</code>
    * [.is(message, fn)](#Rule+is) ⇒ <code>this</code>
    * [.notEmpty()](#Rule+notEmpty) ⇒ <code>this</code>

<a name="Rule+string"></a>

### rule.string() ⇒ <code>this</code>
Sets filter

**Kind**: instance method of [<code>Rule</code>](#Rule)  
<a name="Rule+number"></a>

### rule.number() ⇒ <code>this</code>
Sets filter

**Kind**: instance method of [<code>Rule</code>](#Rule)  
<a name="Rule+boolean"></a>

### rule.boolean() ⇒ <code>this</code>
Sets filter

**Kind**: instance method of [<code>Rule</code>](#Rule)  
<a name="Rule+default"></a>

### rule.default(defaultValue) ⇒ <code>this</code>
Sets default value

**Kind**: instance method of [<code>Rule</code>](#Rule)  

| Param | Type |
| --- | --- |
| defaultValue | <code>\*</code> | 

<a name="Rule+is"></a>

### rule.is(message, fn) ⇒ <code>this</code>
Adds validator

**Kind**: instance method of [<code>Rule</code>](#Rule)  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 
| fn | [<code>validator</code>](#validator) | 

<a name="Rule+notEmpty"></a>

### rule.notEmpty() ⇒ <code>this</code>
Value should not be empty (not falsey)

**Kind**: instance method of [<code>Rule</code>](#Rule)  
<a name="ValidationError"></a>

## ValidationError : <code>Error</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| invalidKey | <code>string</code> | 
| status | <code>number</code> | 
| statusCode | <code>number</code> | 

<a name="validator"></a>

## validator : <code>function</code>
Validator callback

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | found value |
| key | <code>\*</code> | a key, where the value was found |

