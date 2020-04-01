import {Core} from './core';
import {noop, show, showf, escapeTick, partial1} from './internal/fn';
import {isThenable, isFunction} from './internal/is';
import {invalidArgument, typeError} from './internal/throw';

function check$promise(p, f, a){
  return isThenable(p) ? p : typeError(
    'Future.encaseP expects the function it\'s given to return a Promise/Thenable'
    + `\n  Actual: ${show(p)}\n  From calling: ${showf(f)}`
    + `\n  With: ${show(a)}`
  );
}

export function EncaseP(fn, a){
  this._fn = fn;
  this._a = a;
}

EncaseP.prototype = Object.create(Core);

EncaseP.prototype._fork = function EncaseP$fork(rej, res){
  const {_fn, _a} = this;
  check$promise(_fn(_a), _fn, _a).then(escapeTick(res), escapeTick(rej));
  return noop;
};

EncaseP.prototype.toString = function EncaseP$toString(){
  const {_fn, _a} = this;
  return `Future.encaseP(${showf(_fn)}, ${show(_a)})`;
};

export function encaseP(f, x){
  if(!isFunction(f)) invalidArgument('Future.encaseP', 0, 'be a function', f);
  if(arguments.length === 1) return partial1(encaseP, f);
  return new EncaseP(f, x);
}
