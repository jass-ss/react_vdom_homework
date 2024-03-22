export function createHooks(callback) {
  let states = [];
  let count = 0;

  const memoState = [];
  let ref;
  let memoCount = 0;

  const useState = (initState) => {
    const key = count;
    console.log('시작', { count: count, key: key, initState: initState });
    if (!states[key]) states[key] = initState;
    const state = states[key];
    console.log('init!', states, states[key], initState);
    const setState = (string) => {
      console.log('set시작', {
        newState: string,
        old: states[key],
        key: key,
        states: states,
        '?': states[key],
      });
      if (states[key] !== string) {
        states[key] = string;
        console.log('setSate!', states[key], states);
        //count = 0;
        callback();
      }
    };
    count++;
    console.log('count', count);
    return [state, setState];
  };

  const useMemo = (fn, refs) => {
    const key = memoCount;
    if (!ref) {
      ref = JSON.stringify(refs);
      //console.log('noref', refs, ref);
      //console.log('???', fn(), refs);
      memoState[key] = fn();
      //console.log(key, memoState, memoState[key]);
    } else {
      if (ref !== JSON.stringify(refs)) {
        console.log('ref', refs, ref);
        memoState[key] = fn();
        console.log('new', memoState);
      }
    }
    console.log(ref, refs, key, memoState[key]);
    return memoState[key];
  };

  const resetContext = () => {
    count = 0;
    memoCount = 0;
  };

  return { useState, useMemo, resetContext };
}
