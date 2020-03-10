import {Core} from './core';
import {showf} from './internal/fn';
import {isFunction} from './internal/is';
import {invalidArgument} from './internal/throw';

export function Node(fn){
  this._fn = fn;
}

Node.prototype = Object.create(Core);

Node.prototype._fork = function Node$fork(rej, res){
  let open = true;
  this._fn(function Node$done(err, val){
    if(open){
      open = false;
      err ? rej(err) : res(val);
    }
  });
  return function Node$cancel(){ open = false };
};

Node.prototype.toString = function Node$toString(){
  const {_fn} = this;
  return `Future.node(${showf(_fn)})`;
};

export function node(f){
  if(!isFunction(f)) invalidArgument('Future.node', 0, 'be a function', f);
  return new Node(f);
}
