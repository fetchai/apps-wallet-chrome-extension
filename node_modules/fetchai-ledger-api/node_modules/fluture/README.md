# [![Fluture](logo.png)](#butterfly)

[![Chat](https://badges.gitter.im/fluture-js/Fluture.svg)](https://gitter.im/fluture-js/Fluture)
[![NPM Version](https://badge.fury.io/js/fluture.svg)](https://www.npmjs.com/package/fluture)
[![Dependencies](https://david-dm.org/fluture-js/Fluture.svg)](https://david-dm.org/fluture-js/Fluture)
[![Build Status](https://travis-ci.org/fluture-js/Fluture.svg?branch=master)](https://travis-ci.org/fluture-js/Fluture)
[![Code Coverage](https://codecov.io/gh/fluture-js/Fluture/branch/master/graph/badge.svg)](https://codecov.io/gh/fluture-js/Fluture)

Fluture offers a control structure similar to Promises, Tasks, Deferreds, and
what-have-you. Let's call them Futures.

Much like Promises, Futures represent the value arising from the success or
failure of an asynchronous operation (I/O). Though unlike Promises, Futures are
*lazy* and adhere to [the *monadic* interface](#interoperability).

Some of the features provided by Fluture include:

* [Cancellation](#future).
* [Resource management utilities](#resource-management).
* [Stack safe composition and recursion](#stack-safety).
* [Integration](#sanctuary) with [Sanctuary][S].
* A pleasant debugging experience through informative error messages.

For more information:

* [API documentation](#documentation)
* [Wiki: Compare Futures to Promises][wiki:promises]
* [Wiki: Compare Fluture to similar libraries][wiki:similar]
* [Video: Monad a Day by @DrBoolean - Futures][5]

## Usage

> `npm install --save fluture`

### In ES5 or older environments

Fluture depends on these functions being present:
[`Object.create`][JS:Object.create],
[`Object.assign`][JS:Object.assign] and [`Array.isArray`][JS:Array.isArray].
You may need to polyfill one or more.

<!-- eslint-disable no-var -->
<!-- eslint-disable padding-line-between-statements -->
```js
var fs = require('fs');
var Future = require('fluture');

var getPackageName = function(file){
  return Future.node(function(done){ fs.readFile(file, 'utf8', done) })
  .chain(Future.encase(JSON.parse))
  .map(function(x){ return x.name });
};

getPackageName('package.json')
.fork(console.error, console.log);
//> "fluture"
```

### In ES6 or newer environments

The `package.json` sets a `module`-field for build-tools like [Rollup][].

```js
import {readFile} from 'fs';
import {node, encase} from 'fluture';

const getPackageName = file =>
  node(done => { readFile(file, 'utf8', done) })
  .chain(encase(JSON.parse))
  .map(x => x.name);

getPackageName('package.json')
.fork(console.error, console.log);
//> "fluture"
```

## Interoperability

[<img src="https://raw.github.com/fantasyland/fantasy-land/master/logo.png" align="right" width="82" height="82" alt="Fantasy Land" />][FL]
[<img src="https://raw.githubusercontent.com/rpominov/static-land/master/logo/logo.png" align="right" height="82" alt="Static Land" />][6]

* `Future` implements [Fantasy Land][FL] and [Static Land][6] -compatible
  `Bifunctor`, `Monad` and `ChainRec` (`of`, `ap`, `map`, `bimap`, `chain`, `chainRec`).
  All versions of Fantasy Land are supported.
* `Future.Par` implements [Fantasy Land 3][FL] `Alternative` (`of`, `zero`, `map`, `ap`, `alt`).
* The Future representative contains a `@@type` property for [Sanctuary Type Identifiers][STI].

## Butterfly

The name "Fluture" is a conjunction of "FL" (the acronym to [Fantasy Land][FL])
and "future". Fluture means butterfly in Romanian: A creature you might expect
to see in Fantasy Land.

Thanks to [Erik Fuente][8] for the logo, and [WEAREREASONABLEPEOPLE][9] for
sponsoring the project.

## Documentation

### Table of contents

<details open><summary>General</summary>

- [How to read the type signatures](#type-signatures)
- [On stack safety](#stack-safety)
- [Usage with Sanctuary](#sanctuary)
- [Using multiple versions of Fluture](#casting-futures)

</details>

<details><summary>Creating new Futures</summary>

- [`Future`: Create a possibly cancellable Future](#future)
- [`of`: Create a resolved Future](#of)
- [`reject`: Create a rejected Future](#reject)
- [`after`: Create a Future that resolves after a timeout](#after)
- [`rejectAfter`: Create a Future that rejects after a timeout](#rejectafter)
- [`do`: Create a "coroutine" using a generator function](#do)
- [`try`: Create a Future using a possibly throwing function](#try)
- [`tryP`: Create a Future using a Promise-returning function](#tryp)
- [`node`: Create a Future using a Node-style callback](#node)
- [`encase`: Convert a possibly throwing function to a Future function](#encase)
- [`encaseP`: Convert a Promise-retuning function to a Future function](#encasep)
- [`encaseN`: Convert a Nodeback function to a Future function](#encasen)

</details>

<details><summary>Converting between Nodeback APIs and Futures</summary>

- [`node`: Create a Future using a Node-style callback](#node)
- [`encaseN`: Convert a Nodeback function to a Future function](#encasen)
- [`done`: Consume a Future by providing a Nodeback](#done)

</details>

<details><summary>Converting between Promises and Futures</summary>

- [`tryP`: Create a Future using a Promise-returning function](#tryp)
- [`encaseP`: Convert a Promise-retuning function to a Future function](#encasep)
- [`promise`: Convert a Future to a Promise](#promise)

</details>

<details><summary>Transforming and combining Futures</summary>

- [`map`: Synchronously process the success value in a Future](#map)
- [`bimap`: Synchronously process the success or failure value in a Future](#bimap)
- [`chain`: Asynchronously process the success value in a Future](#chain)
- [`swap`: Swap the success with the failure value](#swap)
- [`mapRej`: Synchronously process the failure value in a Future](#maprej)
- [`chainRej`: Asynchronously process the failure value in a Future](#chainrej)
- [`fold`: Coerce success and failure values into the same success value](#fold)
- [`ap`: Combine the success values of multiple Futures using a function](#ap)
- [`and`: Logical *and* for Futures](#and)
- [`or`: Logical *or* for Futures](#or)

</details>

<details><summary>Consuming/forking Futures</summary>

- [`fork`: Standard way to run a Future and get at its result](#fork)
- [`value`: Shorter variant of `fork` for Futures sure to succeed](#value)
- [`done`: Nodeback style `fork`](#done)
- [`promise`: Convert a Future to a Promise](#promise)

</details>

<details><summary>Concurrency related utilities and data structures</summary>

- [`race`: Race two Futures against each other](#race)
- [`both`: Await both success values from two Futures](#both)
- [`parallel`: Await all success values from many Futures](#parallel)
- [`ConcurrentFuture`: A separate data-type for doing algebraic concurrency](#concurrentfuture)

</details>

<details><summary>Resource management and utilities</summary>

- [`hook`: Safely create and dispose resources](#hook)
- [`finally`: Clean up resources](#finally)
- [`cache`: Cache a Future so that it can be forked multiple times](#cache)
- [`isFuture`: Determine whether a value is a Fluture compatible Future](#isfuture)
- [`never`: A Future that never settles](#never)

</details>

### Type signatures

[Hindley-Milner][Guide:HM] type signatures are used to document functions. You
might encounter some additional syntax that we use to describe JavaScript
specific stuff, like [methods](#squiggly-arrows) or functions that take
[multiple arguments at once](#brackets).

#### Squiggly Arrows

In order to document *methods*, we use the squiggly arrow (`~>`). This separates
the implicit `this` argument from the other, explicit, arguments. For example,
the following line signifies a *function*, because it doesn't have a squiggly
arrow in its signature:

```hs
map :: (b -> c) -> Future a b -> Future a c
```

Whereas the next example is a *method*. It needs a `this` as indicated by the
use of the squiggly arrow.

```hs
Future.prototype.map :: Future a b ~> (b -> c) -> Future a c
```

#### Brackets

Most functions exposed by Fluture are curried. This is reflected in their type
signatures by using an arrow at each step where partial application is possible.
For example, the following line signifies a *curried* function, because it has
an arrow after each function argument:

```hs
add :: Number -> Number -> Number
```

We could have chosen to write the above line with "groups of one argument", but
we usually leave the grouping brackets out for brevity:

```hs
add :: (Number) -> (Number) -> Number
```

In order to document functions and methods that are *not* curried, we use
grouping to show which arguments have to be provided at the same time:

```hs
add :: (Number, Number) -> Number
```

#### Types

You'll find that some signatures refer to concrete types, such as `Future`.
This is reference of the types used throughout the documentation:

- **Future** - Instances of Future provided by [compatible versions](#casting-futures) of Fluture.
- **ConcurrentFuture** - [Concurrified][concurrify] Futures ([`Future.Par`](#concurrentfuture)).
- **Promise** - Values which conform to the [Promises/A+ specification][7].
- **Nodeback a b** - A Node-style callback; A function of signature `(a | Nil, b) -> x`.
- **Pair a b** - An array with exactly two elements: `[a, b]`.
- **Iterator** - Objects with `next`-methods which conform to the [Iterator protocol][3].
- **Cancel** - The nullary [cancellation](#future) functions returned from computations.
- **Catchable e f** - A function `f` which may throw an exception `e`.

#### Type classes

Some signatures contain "constrained type variables". These constraints are
expressed by means of [type classes][Guide:constraints], specifically those defined by
[Fantasy Land][FL] and verified by [Sanctuary Type Classes][Z]:

- [**Functor**][Z:Functor] - Values which conform to the
  [Fantasy Land Functor specification][FL:functor].
- [**Bifunctor**][Z:Bifunctor] - Values which conform to the
  [Fantasy Land Bifunctor specification][FL:bifunctor].
- [**Chain**][Z:Chain] - Values which conform to the
  [Fantasy Land Chain specification][FL:chain].
- [**Apply**][Z:Apply] - Values which conform to the
  [Fantasy Land Apply specification][FL:apply].

### Stack safety

Fluture interprets your transformations in a stack safe way. This means that
none of the following operations raise `RangeError: Maximum call stack size exceeded`:

```js
const add1 = x => x + 1;
let m = Future.of(1);

for(let i = 0; i < 100000; i++){
  m = m.map(add1);
}

m.fork(console.error, console.log);
//> 100001
```

```js
const m = (function recur(x){
  const mx = Future.of(x + 1);
  return x < 100000 ? mx.chain(recur) : mx;
}(1));

m.fork(console.error, console.log);
//> 100001
```

To learn more about memory and stack usage under different types of recursion,
see (or execute) [`scripts/test-mem`](scripts/test-mem).

### Sanctuary

When using this module with [Sanctuary Def][$] (and [Sanctuary][S] by
extension) you might run into the following issue:

```js
const S = require('sanctuary');
const Future = require('fluture');
S.I(Future.of(1));
//! Since there is no type of which all the above values are members,
//! the type-variable constraint has been violated.
```

This happens because Sanctuary Def needs to know about the types created by
Fluture to determine whether the type-variables are consistent.

To let Sanctuary know about these types, we can obtain the type definitions from
[`fluture-sanctuary-types`][FST] and pass them to [`S.create`][S:create]:

```js
const {create, env} = require('sanctuary');
const {env: flutureEnv} = require('fluture-sanctuary-types');
const Future = require('fluture');

const S = create({checkTypes: true, env: env.concat(flutureEnv)});

S.I(Future.of(1));
//> Future.of(1)
```

### Casting Futures

Sometimes you may need to convert one Future to another, for example when the
Future was created by another package, or an incompatible version of Fluture.

When [`isFuture`](#isfuture) returns `false`, a conversion is necessary. Usually
the most concise way of doing this is as follows:

```js
const NoFuture = require('incompatible-future');
const incompatible = NoFuture.of('Hello');

//Cast the incompatible Future to our version of Future:
const compatible = Future(incompatible.fork.bind(incompatible));

compatible.both(Future.of('world')).value(console.log);
//> ["Hello", "world"]
```

### Creating Futures

#### Future

<details><summary><code>Future :: ((a -> x, b -> x) -> Cancel) -> Future a b</code></summary>

```hs
Future :: ((a -> x, b -> x) -> Cancel) -> Future a b
```

</details>

Creates a Future with the given computation. A computation is a function which
takes two callbacks. Both are continuations for the computation. The first is
`reject`, commonly abbreviated to `rej`. The second `resolve`, which abbreviates
to `res`. When the computation is finished (possibly asynchronously) it may call
the appropriate continuation with a failure or success value.

```js
Future(function computation(reject, resolve){
  //Asynchronous work:
  const x = setTimeout(resolve, 3000, 'world');
  //Cancellation:
  return () => clearTimeout(x);
});
```

Additionally, the computation may return a nullary function containing
cancellation logic. This function is executed when the Future is cancelled
after it's [forked](#fork).

#### of

<details><summary><code>of :: b -> Future a b</code></summary>

```hs
of        :: b -> Future a b
Future.of :: b -> Future a b
```

</details>

Creates a Future which immediately resolves with the given value. This function
is compliant with the [Fantasy Land Applicative specification][FL:applicative].

```js
const eventualThing = Future.of('world');
eventualThing.fork(
  console.error,
  thing => console.log(`Hello ${thing}!`)
);
//> "Hello world!"
```

#### reject

<details><summary><code>reject :: a -> Future a b</code></summary>

```hs
reject        :: a -> Future a b
Future.reject :: a -> Future a b
```

</details>

Creates a Future which immediately rejects with the given value. Just like `of`
but for the rejection branch.

#### after

<details><summary><code>after :: Number -> b -> Future a b</code></summary>

```hs
after :: Number -> b -> Future a b
```

</details>

Creates a Future which resolves with the given value after n milliseconds.

```js
const eventualThing = Future.after(500, 'world');
eventualThing.fork(console.error, thing => console.log(`Hello ${thing}!`));
//> "Hello world!"
```

#### rejectAfter

<details><summary><code>rejectAfter :: Number -> a -> Future a b</code></summary>

```hs
rejectAfter :: Number -> a -> Future a b
```

</details>

Creates a Future which rejects with the given reason after n milliseconds.

```js
const eventualError = Future.rejectAfter(500, new Error('Kaputt!'));
eventualError.fork(err => console.log('Oh no - ' + err.message), console.log);
//! Oh no - Kaputt!
```

#### do

<details><summary><code>do :: (() -> Iterator) -> Future a b</code></summary>

```hs
do :: (() -> Iterator) -> Future a b
go :: (() -> Iterator) -> Future a b
```

</details>

A specialized version of [fantasy-do][4] which works only for Futures, but has
the advantage of type-checking and not having to pass `Future.of`. Another
advantage is that the returned Future can be forked multiple times, as opposed
to with a general `fantasy-do` solution, where forking the Future a second time
behaves erroneously.

Takes a function which returns an [Iterator](#types), commonly a
generator-function, and chains every produced Future over the previous.

This allows for writing sequential asynchronous code without the pyramid of
doom. It's known as "coroutines" in Promise land, and "do-notation" in Haskell
land.

```js
Future.do(function*(){
  const thing = yield Future.after(300, 'world');
  const message = yield Future.after(300, 'Hello ' + thing);
  return message + '!';
})
.fork(console.error, console.log);
//After 600ms:
//> "Hello world!"
```

Error handling is slightly different in do-notation, you need to [`fold`](#fold)
the error into your control domain, I recommend folding into an [`Either`][S:Either]:

```js
const attempt = Future.fold(S.Left, S.Right);
const ajaxGet = url => Future.reject('Failed to load ' + url);
Future.do(function*(){
  const e = yield attempt(ajaxGet('/message'));
  return S.either(
    e => `Oh no! ${e}`,
    x => `Yippee! ${x}`,
    e
  );
})
.fork(console.error, console.log);
//> "Oh no! Failed to load /message"
```

This function has an alias `go`, for environments in which `do` is a reserved word.

#### try

<details><summary><code>try :: Catchable e (() -> r) -> Future e r</code></summary>

```hs
try     :: Catchable e (() -> r) -> Future e r
attempt :: Catchable e (() -> r) -> Future e r
```

</details>

Creates a Future which resolves with the result of calling the given function,
or rejects with the error thrown by the given function.

Short for [`Future.encase(f, undefined)`](#encase).

```js
const data = {foo: 'bar'};
Future.try(() => data.foo.bar.baz)
.fork(console.error, console.log);
//> [TypeError: Cannot read property 'baz' of undefined]
```

This function has an alias `attempt`, for environments in which `try` is a reserved word.

#### tryP

<details><summary><code>tryP :: (() -> Promise e r) -> Future e r</code></summary>

```hs
tryP :: (() -> Promise e r) -> Future e r
```

</details>

Create a Future which when forked spawns a Promise using the given function and
resolves with its resolution value, or rejects with its rejection reason.

Short for [`Future.encaseP(f, undefined)`](#encasep).

```js
Future.tryP(() => Promise.resolve('Hello'))
.fork(console.error, console.log);
//> "Hello"
```

#### node

<details><summary><code>node :: (Nodeback e r -> x) -> Future e r</code></summary>

```hs
node :: (Nodeback e r -> x) -> Future e r
```

</details>

Creates a Future which rejects with the first argument given to the function,
or resolves with the second if the first is not present.

This is very similar to the [`Future()`-constructor](#future), except that it
takes *a single function* with two arguments instead of *two functions* with a
single argument.

Short for [`Future.encaseN(f, undefined)`](#encasen).

```js
Future.node(done => {
  done(null, 'Hello');
})
.fork(console.error, console.log);
//> "Hello"
```

#### encase

<details><summary><code>encase :: (Catchable e (a -> r)) -> a -> Future e r</code></summary>

```hs
encase  :: (Catchable e ((a      ) -> r)) -> a ->           Future e r
encase2 :: (Catchable e ((a, b   ) -> r)) -> a -> b ->      Future e r
encase3 :: (Catchable e ((a, b, c) -> r)) -> a -> b -> c -> Future e r
```

</details>

Takes a function and a value, and returns a Future which when forked calls the
function with the value and resolves with the result. If the function throws
an exception, it is caught and the Future will reject with the exception:

```js
const data = '{"foo" = "bar"}';
Future.encase(JSON.parse, data)
.fork(console.error, console.log);
//! [SyntaxError: Unexpected token =]
```

Partially applying `encase` with a function `f` allows us to create a "safe"
version of `f`. Instead of throwing exceptions, the encased version always
returns a Future when given the remaining argument(s):

```js
const data = '{"foo" = "bar"}';
const safeJsonParse = Future.encase(JSON.parse);
safeJsonParse(data).fork(console.error, console.log);
//! [SyntaxError: Unexpected token =]
```

Furthermore; `encase2` and `encase3` are binary and ternary versions of
`encase`, applying two or three arguments to the given function respectively.

#### encaseP

<details><summary><code>encaseP  :: ((a) -> Promise e r) -> a -> Future e r</code></summary>

```hs
encaseP  :: ((a) ->       Promise e r) -> a ->           Future e r
encaseP2 :: ((a, b) ->    Promise e r) -> a -> b ->      Future e r
encaseP3 :: ((a, b, c) -> Promise e r) -> a -> b -> c -> Future e r
```

</details>

Allows Promise-returning functions to be turned into Future-returning functions.

Takes a function which returns a Promise, and a value, and returns a Future.
When forked, the Future calls the function with the value to produce the Promise,
and resolves with its resolution value, or rejects with its rejection reason.

```js
const fetchf = Future.encaseP(fetch);

fetchf('https://api.github.com/users/Avaq')
.chain(res => Future.tryP(_ => res.json()))
.map(user => user.name)
.fork(console.error, console.log);
//> "Aldwin Vlasblom"
```

Furthermore; `encaseP2` and `encaseP3` are binary and ternary versions
of `encaseP`, applying two or three arguments to the given function respectively.

#### encaseN

<details><summary><code>encaseN  :: ((a, Nodeback e r) -> x) -> a -> Future e r</code></summary>

```hs
encaseN  :: ((a,       Nodeback e r) -> x) -> a ->           Future e r
encaseN2 :: ((a, b,    Nodeback e r) -> x) -> a -> b ->      Future e r
encaseN3 :: ((a, b, c, Nodeback e r) -> x) -> a -> b -> c -> Future e r
```

</details>

Allows [continuation-passing-style][1] functions to be turned into Future-returning functions.

Takes a function which accepts as its last parameter a
[Nodeback](#types), and a value, and returns a Future.
When forked, the Future calls the function with the value and a Nodeback and
resolves the second argument passed to the Nodeback, or or rejects with the
first argument.

```js
const fs = require('fs');

const read = Future.encaseN2(fs.readFile);

read('README.md', 'utf8')
.map(text => text.split('\n'))
.map(lines => lines[0])
.fork(console.error, console.log);
//> "# [![Fluture](logo.png)](#butterfly)"
```

Furthermore; `encaseN2` and `encaseN3` are binary and ternary versions
of `encaseN`, applying two or three arguments to the given function respectively.

#### chainRec

<details><summary><code>chainRec :: ((a -> c, b -> c, a) -> Future e c, a) -> Future e b</code></summary>

```hs
chainRec        :: ((a -> c, b -> c, a) -> Future e c, a) -> Future e b
Future.chainRec :: ((a -> c, b -> c, a) -> Future e c, a) -> Future e b
```

</details>

Implementation of [Fantasy Land ChainRec][FL:chainrec]. Since Fluture 6.0
introduced [stack safety](#stack-safety) there should be no need to use this
function directly. Instead it's recommended to use [`chain(rec)`](#chain).

### Transforming Futures

#### map

<details><summary><code>map :: Functor m => (a -> b) -> m a -> m b</code></summary>

```hs
map                  :: Functor m  => (a -> b) -> m a -> m        b
Future.map           :: Functor m  => (a -> b) -> m a -> m        b
Future.prototype.map :: Future e a ~> (a -> b)        -> Future e b
```

</details>

Transforms the resolution value inside the Future, and returns a new Future with
the transformed value. This is like doing `promise.then(x => x + 1)`, except
that it's lazy, so the transformation will not be applied before the Future is
forked. The transformation is only applied to the resolution branch: If the
Future is rejected, the transformation is ignored. To learn more about the exact
behaviour of `map`, check out its [spec][FL:functor].

```js
Future.of(1)
.map(x => x + 1)
.fork(console.error, console.log);
//> 2
```

#### bimap

<details><summary><code>bimap :: Bifunctor m => (a -> c) -> (b -> d) -> m a b -> m c d</code></summary>

```hs
bimap                  :: Bifunctor m => (a -> c) -> (b -> d) -> m a b -> m      c d
Future.bimap           :: Bifunctor m => (a -> c) -> (b -> d) -> m a b -> m      c d
Future.prototype.bimap :: Future a b  ~> (a -> c) -> (b -> d)          -> Future c d
```

</details>

Maps the left function over the rejection value, or the right function over the
resolution value, depending on which is present.

```js
Future.of(1)
.bimap(x => x + '!', x => x + 1)
.fork(console.error, console.log);
//> 2

Future.reject('error')
.bimap(x => x + '!', x => x + 1)
.fork(console.error, console.log);
//> "error!"
```

#### chain

<details><summary><code>chain :: Chain m => (a -> m b) -> m a -> m b</code></summary>

```hs
chain                  :: Chain m    => (a -> m        b) -> m a -> m        b
Future.chain           :: Chain m    => (a -> m        b) -> m a -> m        b
Future.prototype.chain :: Future e a ~> (a -> Future e b) ->        Future e b
```

</details>

Allows the creation of a new Future based on the resolution value. This is like
doing `promise.then(x => Promise.resolve(x + 1))`, except that it's lazy, so the
new Future will not be created until the other one is forked. The function is
only ever applied to the resolution value; it's ignored when the Future was
rejected. To learn more about the exact behaviour of `chain`, check out its [spec][FL:chain].

```js
Future.of(1)
.chain(x => Future.of(x + 1))
.fork(console.error, console.log);
//> 2
```

#### swap

<details><summary><code>swap :: Future a b -> Future b a</code></summary>

```hs
swap                  :: Future a b -> Future b a
Future.prototype.swap :: Future a b ~> Future b a
```

</details>

Resolve with the rejection reason, or reject with the resolution value.

```js
Future.of(new Error('It broke')).swap().fork(console.error, console.log);
//! [It broke]

Future.reject('Nothing broke').swap().fork(console.error, console.log);
//> "Nothing broke"
```

#### mapRej

<details><summary><code>mapRej :: (a -> c) -> Future a b -> Future c b</code></summary>

```hs
mapRej                  ::               (a -> c) -> Future a b -> Future c b
Future.prototype.mapRej :: Future a b ~> (a -> c)               -> Future c b
```

</details>

Map over the **rejection** reason of the Future. This is like `map`, but for the
rejection branch.

```js
Future.reject(new Error('It broke!'))
.mapRej(err => new Error('Some extra info: ' + err.message))
.fork(console.error, console.log);
//! [Some extra info: It broke!]
```

#### chainRej

<details><summary><code>chainRej :: (a -> Future a c) -> Future a b -> Future a c</code></summary>

```hs
chainRej                  ::               (a -> Future a c) -> Future a b -> Future a c
Future.prototype.chainRej :: Future a b ~> (a -> Future a c)               -> Future a c
```

</details>

Chain over the **rejection** reason of the Future. This is like `chain`, but for
the rejection branch.

```js
Future.reject(new Error('It broke!')).chainRej(err => {
  console.error(err);
  return Future.of('All is good');
})
.fork(console.error, console.log);
//> "All is good"
```

#### fold

<details><summary><code>fold :: (a -> c) -> (b -> c) -> Future a b -> Future d c</code></summary>

```hs
fold                  ::               (a -> c) -> (b -> c) -> Future a b -> Future d c
Future.prototype.fold :: Future a b ~> (a -> c,     b -> c)               -> Future d c
```

</details>

Applies the left function to the rejection value, or the right function to the
resolution value, depending on which is present, and resolves with the result.

This provides a convenient means to ensure a Future is always resolved. It can
be used with other type constructors, like [`S.Either`][S:Either], to maintain a
representation of failures:

```js
Future.of('hello')
.fold(S.Left, S.Right)
.value(console.log);
//> Right('hello')

Future.reject('it broke')
.fold(S.Left, S.Right)
.value(console.log);
//> Left('it broke')
```

### Combining Futures

#### ap

<details><summary><code>ap :: Apply m => m (a -> b) -> m a -> m b</code></summary>

```hs
ap                  :: Apply m => m        (a -> b) -> m        a -> m        b
Future.ap           :: Apply m => m        (a -> b) -> m        a -> m        b
Future.prototype.ap ::            Future e (a -> b) ~> Future e a -> Future e b
```

</details>

Applies the function contained in the left-hand Future or Apply to the value
contained in the right-hand Future or Apply. If one of the Futures rejects the
resulting Future will also be rejected.

```js
Future.of(x => y => x + y)
.ap(Future.of(1))
.ap(Future.of(2))
.fork(console.error, console.log);
//> 3
```

Note that even though `#ap` does *not* conform to the latest [spec][FL:apply],
the hidden `fantasy-land/ap`-method *does*. Therefore Future remains fully
compliant to Fantasy Land.

#### and

<details><summary><code>and :: Future a b -> Future a c -> Future a c</code></summary>

```hs
and                  :: Future a b -> Future a c -> Future a c
Future.prototype.and :: Future a b ~> Future a c -> Future a c
```

</details>

Logical *and* for Futures.

Returns a new Future which either rejects with the first rejection reason, or
resolves with the last resolution value once and if both Futures resolve. This
behaves analogously to how JavaScript's *and*-operator does.

<!-- eslint-disable no-undef -->
```js
//An asynchronous version of:
//isResolved() && getValue();
isResolved().and(getValue());
```

```js
//Asynchronous "all", where the resulting Future will be the leftmost to reject:
const all = ms => ms.reduce(Future.and, Future.of(true));
all([Future.after(20, 1), Future.of(2)]).value(console.log);
//> 2
```

#### or

<details><summary><code>or :: Future a b -> Future a b -> Future a b</code></summary>

```hs
or                  :: Future a b -> Future a b -> Future a b
Future.prototype.or :: Future a b ~> Future a b -> Future a b
```

</details>

Logical *or* for Futures.

Returns a new Future which either resolves with the first resolution value, or
rejects with the last rejection value once and if both Futures reject. This
behaves analogously to how JavaScript's *or*-operator does.

<!-- eslint-disable no-undef -->
```js
//An asynchronous version of:
//planA() || planB();
planA().or(planB());
```

```js
//Asynchronous "any", where the resulting Future will be the leftmost to resolve:
const any = ms => ms.reduce(Future.or, Future.reject('empty list'));
any([Future.reject(1), Future.after(20, 2), Future.of(3)]).value(console.log);
//> 2
```

### Consuming Futures

#### fork

<details><summary><code>fork :: (a -> x) -> (b -> x) -> Future a b -> Cancel</code></summary>

```hs
fork                  ::               (a -> x) -> (b -> x) -> Future a b -> Cancel
Future.prototype.fork :: Future a b ~> (a -> x,     b -> x)               -> Cancel
```

</details>

Execute the computation that was passed to the Future at [construction](#future)
using the given `reject` and `resolve` callbacks.

```js
Future.of('world').fork(
  err => console.log(`Oh no! ${err.message}`),
  thing => console.log(`Hello ${thing}!`)
);
//> "Hello world!"

Future.reject(new Error('It broke!')).fork(
  err => console.log(`Oh no! ${err.message}`),
  thing => console.log(`Hello ${thing}!`)
);
//> "Oh no! It broke!"

const consoleFork = Future.fork(console.error, console.log);
consoleFork(Future.of('Hello'));
//> "Hello"
```

After you `fork` a Future, the computation will start running. If you wish to
cancel the computation, you may use the function returned by `fork`:

```js
const fut = Future.after(300, 'hello');
const cancel = fut.fork(console.error, console.log);
cancel();
//Nothing will happen. The Future was cancelled before it could settle.
```

#### value

<details><summary><code>value :: (b -> x) -> Future a b -> Cancel</code></summary>

```hs
value                  ::               (b -> x) -> Future a b -> Cancel
Future.prototype.value :: Future a b ~> (b -> x)               -> Cancel
```

</details>

Extracts the value from a resolved Future by forking it. Only use this function
if you are sure the Future is going to be resolved, for example; after using
`.fold()`. If the Future rejects and `value` was used, an (likely uncatchable)
`Error` will be thrown.

```js
Future.reject(new Error('It broke'))
.fold(S.Left, S.Right)
.value(console.log);
//> Left([Error: It broke])
```

Just like [fork](#fork), `value` returns the `Cancel` function:

```js
Future.after(300, 'hello').value(console.log)();
//Nothing will happen. The Future was cancelled before it could settle.
```

#### done

<details><summary><code>done :: Nodeback a b -> Future a b -> Cancel</code></summary>

```hs
done                  ::               Nodeback a b -> Future a b -> Cancel
Future.prototype.done :: Future a b ~> Nodeback a b               -> Cancel
```

</details>

Fork the Future into a [Nodeback](#types).

```js
Future.of('hello').done((err, val) => console.log(val));
//> "hello"
```

This is like [fork](#fork), but instead of taking two unary functions, it takes
a single binary function. As with `fork()`, `done()` returns [`Cancel`](#types):

```js
const m = Future.after(300, 'hello');
const cancel = m.done((err, val) => console.log(val));
cancel();
//Nothing will happen. The Future was cancelled before it could settle.
```

#### promise

<details><summary><code>promise :: Future a b -> Promise b a</code></summary>

```hs
promise                  :: Future a b -> Promise b a
Future.prototype.promise :: Future a b ~> Promise b a
```

</details>

An alternative way to `fork` the Future. This eagerly forks the Future and
returns a Promise of the result. This is useful if some API wants you to give it
a Promise. It's the only method which forks the Future without a forced way to
handle the rejection branch, so I recommend against using it for anything else.

```js
Future.of('Hello').promise().then(console.log);
//> "Hello"
```

### Parallelism

#### race

<details><summary><code>race :: Future a b -> Future a b -> Future a b</code></summary>

```hs
race                  :: Future a b -> Future a b -> Future a b
Future.prototype.race :: Future a b ~> Future a b -> Future a b
```

</details>

Race two Futures against each other. Creates a new Future which resolves or
rejects with the resolution or rejection value of the first Future to settle.

```js
Future.after(100, 'hello')
.race(Future.after(50, 'bye'))
.fork(console.error, console.log);
//> "bye"

const first = futures => futures.reduce(Future.race, Future.never);
first([
  Future.after(100, 'hello'),
  Future.after(50, 'bye'),
  Future.rejectAfter(25, 'nope')
])
.fork(console.error, console.log);
//! "nope"
```

#### both

<details><summary><code>both :: Future a b -> Future a c -> Future a (Pair b c)</code></summary>

```hs
both                  :: Future a b -> Future a c -> Future a (Pair b c)
Future.prototype.both :: Future a b ~> Future a c -> Future a (Pair b c)
```

</details>

Run two Futures in parallel. Basically like calling
[`Future.parallel`](#parallel) with exactly two Futures:

```js
const a = Future.of('a');
const b = Future.of('b');

Future.both(a, b).fork(console.error, console.log);
//> ['a', 'b']
```

#### parallel

<details><summary><code>parallel :: PositiveInteger -> Array (Future a b) -> Future a (Array b)</code></summary>

```hs
parallel :: PositiveInteger -> Array (Future a b) -> Future a (Array b)
```

</details>

Creates a Future which when forked runs all Futures in the given `array` in
parallel, ensuring no more than `limit` Futures are running at once.

```js
const tenFutures = Array.from(Array(10).keys()).map(Future.after(20));

//Runs all Futures in sequence:
Future.parallel(1, tenFutures).fork(console.error, console.log);
//after about 200ms:
//> [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

//Runs upto five Futures in parallel:
Future.parallel(5, tenFutures).fork(console.error, console.log);
//after about 40ms:
//> [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

//Runs all Futures in parallel:
Future.parallel(Infinity, tenFutures).fork(console.error, console.log);
//after about 20ms:
//> [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

If you want to settle all Futures, even if some may fail, you can use this in
combination with [fold](#fold):

```js
const instableFutures = Array.from({length: 4}, (_, i) =>
  Future.node(done => done(Math.random() > 0.75 ? 'failed' : null, i))
);

const stabalizedFutures = instableFutures.map(Future.fold(S.Left, S.Right));

Future.parallel(Infinity, stabalizedFutures).fork(console.error, console.log);
//> [ Right(0), Left("failed"), Right(2), Right(3) ]
```

#### ConcurrentFuture

<details><summary><code>Par :: Future a b -> ConcurrentFuture a b</code></summary>

```hs
Par :: Future a b -> ConcurrentFuture a b
seq :: ConcurrentFuture a b -> Future a b
```

</details>

ConcurrentFuture (or `Par` for short) is the result of applying
[`concurrify`][concurrify] to `Future`. It provides a mechanism for constructing
a [Fantasy Land `Alternative`][FL:alternative] from a member of `Future`. This
allows Futures to benefit from the Alternative Interface, which includes
parallel `ap`, `zero` and `alt`.

The idea is that you can switch back and forth between `Future` and
`ConcurrentFuture`, using `Par` and `seq`, to get sequential or concurrent
behaviour respectively. It's useful if you want a purely algebraic alternative
to [`parallel`](#parallel) and [`race`](#race).

```js
const {of, ap, zero, alt, sequence} = require('sanctuary');
const {Future, Par, seq} = require('fluture');

//Some dummy values
const x = 1;
const f = a => a + 1;

//The following two are equal ways to construct a ConcurrentFuture
const parx = of(Par, x);
const parf = Par(of(Future, f));

//We can make use of parallel apply
seq(ap(parx, parf)).value(console.log);
//> 2

//Or concurrent sequencing
seq(sequence(Par, [parx, parf])).value(console.log);
//> [x, f]

//Or racing with alternative
seq(alt(zero(Par), parx)).value(console.log);
//> 1
```

### Resource management

Functions listed under this category allow for more fine-grained control over
the flow of acquired values.

#### hook

<details><summary><code>hook :: Future a b -> (b -> Future a c) -> (b -> Future a d) -> Future a d</code></summary>

```hs
hook :: Future a b -> (b -> Future a c) -> (b -> Future a d) -> Future a d
```

</details>

Allows a Future-returning function to be decorated with resource acquistion
and disposal. The signature is like `hook(acquire, dispose, consume)`, where
`acquire` is a Future which might create connections, open file handlers, etc.
`dispose` is a function that takes the result from `acquire` and should be used
to clean up (close connections etc) and `consume` also takes the result from
`acquire`, and may be used to perform any arbitrary computations using the
resource. The resolution value of `dispose` is ignored.

<!-- eslint-disable no-undef -->
```js
const withConnection = Future.hook(
  openConnection('localhost'),
  closeConnection
);

withConnection(
  conn => query(conn, 'EAT * cakes FROM bakery')
)
.fork(console.error, console.log);
```

In the case that a hooked Future is *cancelled* after the resource was acquired,
`dispose` will be executed and immediately cancelled. This means that rejections
which may happen during this disposal are **silently ignored**. To ensure that
resources are disposed during cancellation, you might synchronously dispose
resources in the `cancel` function of the disposal Future:

<!-- eslint-disable no-unused-vars -->
```js
const closeConnection = conn => Future((rej, res) => {

  //We try to dispose gracefully.
  conn.flushGracefully(err => {
    if(err === null){
      conn.close();
      res();
    }else{
      rej(err);
    }
  });

  //On cancel, we force dispose.
  return () => conn.close();

});
```

#### finally

<details><summary><code>finally :: Future a c -> Future a b -> Future a b</code></summary>

```hs
finally                  ::               Future a c -> Future a b -> Future a b
lastly                   ::               Future a c -> Future a b -> Future a b
Future.prototype.finally :: Future a b ~> Future a c               -> Future a b
Future.prototype.lastly  :: Future a b ~> Future a c               -> Future a b
```

</details>

Run a second Future after the first settles (successfully or unsuccessfully).
Rejects with the rejection reason from the first or second Future, or resolves
with the resolution value from the first Future.

```js
Future.of('Hello')
.finally(Future.of('All done!').map(console.log))
.fork(console.error, console.log);
//> "All done!"
//> "Hello"
```

Note that the *first* Future is given as the *last* argument to `Future.finally()`:

```js
const program = S.pipe([
  Future.of,
  Future.finally(Future.of('All done!').map(console.log)),
  Future.fork(console.error, console.log)
]);

program('Hello');
//> "All done!"
//> "Hello"
```

As with [`hook`](#hook); when the Future is cancelled before the *finally
computation* is running, the *finally computation* is executed and immediately
cancelled.

This function has an alias `lastly`, for environments in which `finally` is a reserved word.

### Utility functions

#### cache

<details><summary><code>cache :: Future a b -> Future a b</code></summary>

```hs
cache :: Future a b -> Future a b
```

</details>

Returns a Future which caches the resolution value of the given Future so that
whenever it's forked, it can load the value from cache rather than reexecuting
the chain.

```js
const {readFile} = require('fs');
const eventualPackage = Future.cache(
  Future.node(done => {
    console.log('Reading some big data');
    readFile('package.json', 'utf8', done);
  })
);

eventualPackage.fork(console.error, console.log);
//> "Reading some big data"
//> "{...}"

eventualPackage.fork(console.error, console.log);
//> "{...}"
```

#### isFuture

<details><summary><code>isFuture :: a -> Boolean</code></summary>

```hs
isFuture :: a -> Boolean
```

</details>

Returns true for [Futures](#types) and false for everything else. This function
(and [`S.is`][S:is]) also return `true` for instances of Future that were
created within other contexts. It is therefore recommended to use this over
`instanceof`, unless your intent is to explicitly check for Futures created
using the exact `Future` constructor you're testing against.

<!-- eslint-disable no-unused-expressions -->
```js
const Future1 = require('/path/to/fluture');
const Future2 = require('/other/path/to/fluture');
const noop = () => {};

const m1 = Future1(noop);
Future1.isFuture(m1) === (m1 instanceof Future1);
//> true

const m2 = Future2(noop);
Future1.isFuture(m2) === (m2 instanceof Future1);
//> false
```

#### never

<details><summary><code>never :: Future a a</code></summary>

```hs
never :: Future a a
```

</details>

A Future that never settles. Can be useful as an initial value when reducing
with [`race`](#race), for example.

#### isNever

<details><summary><code>isNever :: a -> Boolean</code></summary>

```hs
isNever :: a -> Boolean
```

</details>

Returns `true` if the given input is a `never`.

## License

[MIT licensed](LICENSE)

<!-- References -->

[wiki:similar]:         https://github.com/fluture-js/Fluture/wiki/Comparison-of-Future-Implementations
[wiki:promises]:        https://github.com/fluture-js/Fluture/wiki/Comparison-to-Promises

[FL]:                   https://github.com/fantasyland/fantasy-land
[FL:alternative]:       https://github.com/fantasyland/fantasy-land#alternative
[FL:functor]:           https://github.com/fantasyland/fantasy-land#functor
[FL:chain]:             https://github.com/fantasyland/fantasy-land#chain
[FL:apply]:             https://github.com/fantasyland/fantasy-land#apply
[FL:applicative]:       https://github.com/fantasyland/fantasy-land#applicative
[FL:bifunctor]:         https://github.com/fantasyland/fantasy-land#bifunctor
[FL:chainrec]:          https://github.com/fantasyland/fantasy-land#chainrec

[JS:Object.create]:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
[JS:Object.assign]:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
[JS:Array.isArray]:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray

[S]:                    https://sanctuary.js.org/
[S:Either]:             https://sanctuary.js.org/#either-type
[S:is]:                 https://sanctuary.js.org/#is
[S:create]:             https://sanctuary.js.org/#create

[STI]:                  https://github.com/sanctuary-js/sanctuary-type-identifiers
[FST]:                  https://github.com/fluture-js/fluture-sanctuary-types

[Z]:                    https://github.com/sanctuary-js/sanctuary-type-classes#readme
[Z:Functor]:            https://github.com/sanctuary-js/sanctuary-type-classes#Functor
[Z:Bifunctor]:          https://github.com/sanctuary-js/sanctuary-type-classes#Bifunctor
[Z:Chain]:              https://github.com/sanctuary-js/sanctuary-type-classes#Chain
[Z:Apply]:              https://github.com/sanctuary-js/sanctuary-type-classes#Apply

[$]:                    https://github.com/sanctuary-js/sanctuary-def

[concurrify]:           https://github.com/fluture-js/concurrify

[Rollup]:               https://rollupjs.org/

[Guide:HM]:             https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch7.html
[Guide:constraints]:    https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch7.html#constraints

[1]:                    https://en.wikipedia.org/wiki/Continuation-passing_style
[3]:                    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterator
[4]:                    https://github.com/russellmcc/fantasydo
[5]:                    https://vimeo.com/106008027
[6]:                    https://github.com/rpominov/static-land
[7]:                    https://promisesaplus.com/
[8]:                    http://erikfuente.com/
[9]:                    http://wearereasonablepeople.nl/
