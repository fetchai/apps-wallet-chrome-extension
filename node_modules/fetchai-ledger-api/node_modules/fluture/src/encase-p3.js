import {Core} from './core';
import {noop, show, showf, escapeTick, partial1, partial2, partial3} from './internal/fn';
import {isThenable, isFunction} from './internal/is';
import {invalidArgument, typeError} from './internal/throw';

function check$promise(p, f, a, b, c){
  return isThenable(p) ? p : typeError(
    'Future.encaseP3 expects the function it\'s given to return a Promise/Thenable'
    + `\n  Actual: ${show(p)}\n  From calling: ${showf(f)}`
    + `\n  With 1: ${show(a)}`
    + `\n  With 2: ${show(b)}`
    + `\n  With 3: ${show(c)}`
  );
}

export function EncaseP3(fn, a, b, c){
  this._fn = fn;
  this._a = a;
  this._b = b;
  this._c = c;
}

EncaseP3.prototype = Object.create(Core);

EncaseP3.prototype._fork = function EncaseP3$fork(rej, res){
  const {_fn, _a, _b, _c} = this;
  check$promise(_fn(_a, _b, _c), _fn, _a, _b, _c).then(escapeTick(res), escapeTick(rej));
  return noop;
};

EncaseP3.prototype.toString = function EncaseP3$toString(){
  const {_fn, _a, _b, _c} = this;
  return `Future.encaseP3(${show(_fn)}, ${show(_a)}, ${show(_b)}, ${show(_c)})`;
};

export function encaseP3(f, x, y, z){
  if(!isFunction(f)) invalidArgument('Future.encaseP3', 0, 'be a function', f);

  switch(arguments.length){
    case 1: return partial1(encaseP3, f);
    case 2: return partial2(encaseP3, f, x);
    case 3: return partial3(encaseP3, f, x, y);
    default: return new EncaseP3(f, x, y, z);
  }
}
