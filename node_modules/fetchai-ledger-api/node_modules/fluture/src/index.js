import Future from './future';
import {isFuture, isNever, never, of, reject} from './core';

import * as dispatchers from './dispatchers';

import {after, rejectAfter} from './after';
import {attempt} from './attempt';
import {cache} from './cache';
import {chainRec} from './chain-rec';
import {encase} from './encase';
import {encase2} from './encase2';
import {encase3} from './encase3';
import {encaseN} from './encase-n';
import {encaseN2} from './encase-n2';
import {encaseN3} from './encase-n3';
import {encaseP} from './encase-p';
import {encaseP2} from './encase-p2';
import {encaseP3} from './encase-p3';
import {go} from './go';
import {hook} from './hook';
import {node} from './node';
import {Par, seq} from './par';
import {parallel} from './parallel';
import {tryP} from './try-p';

import {error} from './internal/throw';

if(typeof Object.create !== 'function') error('Please polyfill Object.create to use Fluture');
if(typeof Object.assign !== 'function') error('Please polyfill Object.assign to use Fluture');
if(typeof Array.isArray !== 'function') error('Please polyfill Array.isArray to use Fluture');

export default Object.assign(Future, dispatchers, {
  Future,
  after,
  attempt,
  cache,
  chainRec,
  do: go,
  encase,
  encase2,
  encase3,
  encaseN,
  encaseN2,
  encaseN3,
  encaseP,
  encaseP2,
  encaseP3,
  go,
  hook,
  isFuture,
  isNever,
  never,
  node,
  of,
  Par,
  parallel,
  reject,
  rejectAfter,
  seq,
  try: attempt,
  tryP,
});
