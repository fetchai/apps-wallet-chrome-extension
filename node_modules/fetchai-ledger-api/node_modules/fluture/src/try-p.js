import {Core} from './core';
import {noop, show, showf, escapeTick} from './internal/fn';
import {isThenable, isFunction} from './internal/is';
import {invalidArgument, typeError} from './internal/throw';

function check$promise(p, f){
  return isThenable(p) ? p : typeError(
    'Future.tryP expects the function it\'s given to return a Promise/Thenable'
    + `\n  Actual: ${show(p)}\n  From calling: ${showf(f)}`
  );
}

export function TryP(fn){
  this._fn = fn;
}

TryP.prototype = Object.create(Core);

TryP.prototype._fork = function TryP$fork(rej, res){
  const {_fn} = this;
  check$promise(_fn(), _fn).then(escapeTick(res), escapeTick(rej));
  return noop;
};

TryP.prototype.toString = function TryP$toString(){
  const {_fn} = this;
  return `Future.tryP(${show(_fn)})`;
};

export function tryP(f){
  if(!isFunction(f)) invalidArgument('Future.tryP', 0, 'be a function', f);
  return new TryP(f);
}
