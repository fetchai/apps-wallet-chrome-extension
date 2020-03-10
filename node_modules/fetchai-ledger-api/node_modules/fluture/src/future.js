import {Future, of, reject} from './core';
import {FL, $$type} from './internal/const';
import {chainRec} from './chain-rec';
import {ap, map, bimap, chain} from './dispatchers';

Future['@@type'] = $$type;
Future[FL.of] = Future.of = of;
Future[FL.chainRec] = Future.chainRec = chainRec;
Future.reject = reject;

Future.ap = ap;

Future.prototype[FL.ap] = function Future$FL$ap(other){
  return other._ap(this);
};

Future.map = map;

Future.prototype[FL.map] = function Future$FL$map(mapper){
  return this._map(mapper);
};

Future.bimap = bimap;

Future.prototype[FL.bimap] = function Future$FL$bimap(lmapper, rmapper){
  return this._bimap(lmapper, rmapper);
};

Future.chain = chain;

Future.prototype[FL.chain] = function Future$FL$chain(mapper){
  return this._chain(mapper);
};

export default Future;
