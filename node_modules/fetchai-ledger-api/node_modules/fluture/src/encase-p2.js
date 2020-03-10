import {Core} from './core';
import {noop, show, showf, escapeTick, partial1, partial2} from './internal/fn';
import {isThenable, isFunction} from './internal/is';
import {invalidArgument, typeError} from './internal/throw';

function check$promise(p, f, a, b){
  return isThenable(p) ? p : typeError(
    'Future.encaseP2 expects the function it\'s given to return a Promise/Thenable'
    + `\n  Actual: ${show(p)}\n  From calling: ${showf(f)}`
    + `\n  With 1: ${show(a)}`
    + `\n  With 2: ${show(b)}`
  );
}

export function EncaseP2(fn, a, b){
  this._fn = fn;
  this._a = a;
  this._b = b;
}

EncaseP2.prototype = Object.create(Core);

EncaseP2.prototype._fork = function EncaseP2$fork(rej, res){
  const {_fn, _a, _b} = this;
  check$promise(_fn(_a, _b), _fn, _a, _b).then(escapeTick(res), escapeTick(rej));
  return noop;
};

EncaseP2.prototype.toString = function EncaseP2$toString(){
  const {_fn, _a, _b} = this;
  return `Future.encaseP2(${showf(_fn)}, ${show(_a)}, ${show(_b)})`;
};

export function encaseP2(f, x, y){
  if(!isFunction(f)) invalidArgument('Future.encaseP2', 0, 'be a function', f);

  switch(arguments.length){
    case 1: return partial1(encaseP2, f);
    case 2: return partial2(encaseP2, f, x);
    default: return new EncaseP2(f, x, y);
  }
}
