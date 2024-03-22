export function createHooks(callback) {
  let states = [];
  let count = 0;

  const memoState = [];
  const ref = [];
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
    if (!refs[key]) {
      console.log('==', { key: key, refs: refs[key] });
      memoState[key] = JSON.stringify(fn());
    }
    if (ref[key] !== refs[key]) {
      console.log('!', { key: key, refs: refs[key] });
      ref[key] = refs[key];
      memoState[key] = fn();
    }
    return memoState[key];
  };

  const resetContext = () => {
    count = 0;
    memoCount = 0;
  };

  return { useState, useMemo, resetContext };
}
