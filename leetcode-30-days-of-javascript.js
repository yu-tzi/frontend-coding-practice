/* EASY */

// 1. 
// Write a function createHelloWorld. It should return a new function that always returns "Hello World".

var createHelloWorld = function () {
  return function (...args) {
    return "Hello World";
  };
};

const f = createHelloWorld();
// console.log(f()); // "Hello World"

// 2. 
// Given an integer n, return a counter function. This counter function initially returns n and then returns 1 more than the previous value every subsequent time it is called (n, n + 1, n + 2, etc).

var createCounter = function (n) {
  let count = n
  return function () {
    return count++
  };
};

const counter = createCounter(10)
// console.log(counter())
// console.log(counter())
// console.log(counter())

// 3. 
// Given an integer array arr and a mapping function fn, return a new array with a transformation applied to each element.
// The returned array should be created such that returnedArray[i] = fn(arr[i], i).

var map = function (arr, fn) {
  let newArr = []
  for (let i = 0; i < arr.length; i++) {
    newArr[i] = fn(arr[i], i)
  }
  return newArr
};

const newArray = map([1, 2, 3], (n, i) => { return n + i }); // [1,3,5]
// console.log(newArray)

// 4. 
// Given an array of functions [f1, f2, f3, ..., fn], return a new function fn that is the function composition of the array of functions.
// The function composition of [f(x), g(x), h(x)] is fn(x) = f(g(h(x))).

var compose = function (functions) {

  return function (x) {
    let value = x
    for (let i = functions.length - 1; i >= 0; i--) {
      value = functions[i](value)
    }
    return value
  }
};

// 5.
// Given two promises promise1 and promise2, return a new promise. promise1 and promise2 will both resolve with a number. 
// The returned promise should resolve with the sum of the two numbers.

var addTwoPromises = async function (promise1, promise2) {
  return promise1.then((result1) => {
    return promise2.then((result2) => {
      return new Promise((resolve, reject) => {
        resolve(result1 + result2)
      });
    })
  })
};


addTwoPromises(Promise.resolve(2), Promise.resolve(2))
  .then(result => console.log(result))

// promise.all 的做法

var addTwoPromises2 = async function (promise1, promise2) {
  const [result1, result2] = await Promise.all([promise1, promise2])
  return new Promise(resolve => resolve(result1 + result2))
};

addTwoPromises2(Promise.resolve(2), Promise.resolve(2))
  .then(result => console.log(result))

// 6.
// Given a function fn, an array of arguments args, and a timeout t in milliseconds, return a cancel function cancelFn.
// After a delay of cancelTimeMs, the returned cancel function cancelFn will be invoked.
// setTimeout(cancelFn, cancelTimeMs)
// Initially, the execution of the function fn should be delayed by t milliseconds.
// If, before the delay of t milliseconds, the function cancelFn is invoked, it should cancel the delayed execution of fn. Otherwise, if cancelFn is not invoked within the specified delay t, fn should be executed with the provided args as arguments.

var cancellable = function (fn, args, t) {
  const timer = setTimeout(() => { fn(...args) }, t)
  return function () {
    // 回傳一個 function，若執行此 function，可取消上面設定的 timer
    clearTimeout(timer)
  }
};

/**
 *  const result = []
 *
 *  const fn = (x) => x * 5
 *  const args = [2], t = 20, cancelT = 50
 *
 *  const log = (...argsArr) => {
 *      result.push(fn(...argsArr))
 *  }
 *       
 *  const cancel = cancellable(fn, args, t);
 *           
 *  setTimeout(() => {
 *     cancel()
 *     // console.log(result) // [{"time":20,"returned":10}]
 *  }, cancelT)
 */

/* MEDIUM */

// 1. 
//Given a function fn, return a memoized version of that function.
// A memoized function is a function that will never be called twice with the same inputs. Instead it will return a cached value.
// You can assume there are 3 possible input functions: sum, fib, and factorial.
// sum accepts two integers a and b and returns a + b. Assume that if a value has already been cached for the arguments (b, a) where a != b, it cannot be used for the arguments (a, b). For example, if the arguments are (3, 2) and (2, 3), two separate calls should be made.
// fib accepts a single integer n and returns 1 if n <= 1 or fib(n - 1) + fib(n - 2) otherwise.
// factorial accepts a single integer n and returns 1 if n <= 1 or factorial(n - 1) * n otherwise.


let callCount = 0;
function memoize(fn) {
  const memoMap = new Map()
  return function (...args) {
    if (!memoMap.get(`${args[0]}&${args[1]}`)) {
      memoMap.set(`${args[0]}&${args[1]}`, fn(...args))
      callCount++
      return fn(...args)
    } else {
      return memoMap.get(`${args[0]}&${args[1]}`)
    }
  }
}

const sum = (a, b) => a + b;
const memoizedSum = memoize(sum);
// console.log(memoizedSum(2, 2))
// console.log(memoizedSum(2, 2))
// console.log(callCount)
// console.log(memoizedSum(1, 2))
// console.log(callCount)

// others answer
// 用 object 去除重複
// 這裡的 fn.apply(this, args) 與 fn(...args) 在功能上是相似的，apply 的差異在可以設定函式內的 this 值

function anotherMemoize(fn) {

  const cache = {};
  return function (...args) {
    const key = JSON.stringify(args);
    if (key in cache) {
      return cache[key];
    }

    const result = fn.apply(this, args);
    cache[key] = result;
    return result;
  }

}

// 2.
// Given an asynchronous function fn and a time t in milliseconds, return a new time limited version of the input function. fn takes arguments provided to the time limited function.
// The time limited function should follow these rules:
// If the fn completes within the time limit of t milliseconds, the time limited function should resolve with the result.
// If the execution of the fn exceeds the time limit, the time limited function should reject with the string "Time Limit Exceeded".

var timeLimit = function (fn, t) {
  return async function (...args) {
    return new Promise((resolve, reject) => {
      if (args > t) {
        reject('Time Limit Exceeded')
      } else {
        fn(t).then((result) => {
          resolve(result)
        })
      }
    })
  }
};

const limited = timeLimit((t) => new Promise(res => setTimeout(res, t)), 100);
limited(150).catch(console.log) // "Time Limit Exceeded" at t=100ms

// promise race 的做法

var timeLimit2 = function (fn, t) {
  return async function (...args) {
    const originalFnPromise = fn(...args);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject('Time Limit Exceeded')
      }, t);
    })
    return Promise.race([originalFnPromise, timeoutPromise]);
  }
};

const limited2 = timeLimit2((t) => new Promise(res => setTimeout(res, t)), 100);
limited2(150).catch(console.log) // "Time Limit Exceeded" at t=100ms

// 3.
