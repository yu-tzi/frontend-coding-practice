// EASY

// Write a function createHelloWorld. It should return a new function that always returns "Hello World".

/**
 * @return {Function}
 */
var createHelloWorld = function () {
  return function (...args) {
    return "Hello World";
  };
};

const f = createHelloWorld();
console.log(f()); // "Hello World"

// Given an integer n, return a counter function. This counter function initially returns n and then returns 1 more than the previous value every subsequent time it is called (n, n + 1, n + 2, etc).
/**
 * @param {number} n
 * @return {Function} counter
 */
var createCounter = function(n) {
  let count = n
  return function() {
     return count++ 
  };
};

const counter = createCounter(10)
console.log(counter())
console.log(counter())
console.log(counter())

// Given an integer array arr and a mapping function fn, return a new array with a transformation applied to each element.
// The returned array should be created such that returnedArray[i] = fn(arr[i], i).

/**
 * @param {number[]} arr
 * @param {Function} fn
 * @return {number[]}
 */
var map = function(arr, fn) {
  let newArr = []
  for(let i = 0; i < arr.length; i++){
    newArr[i] = fn(arr[i], i)
  }
  return newArr
};

const newArray = map([1,2,3], (n, i)=>{return n+i}); // [1,3,5]
console.log(newArray)

// Given an array of functions [f1, f2, f3, ..., fn], return a new function fn that is the function composition of the array of functions.
// The function composition of [f(x), g(x), h(x)] is fn(x) = f(g(h(x))).

/**
 * @param {Function[]} functions
 * @return {Function}
 */
var compose = function(functions) {
    
  return function(x) {
    let value = x
      for(let i=functions.length-1; i>=0; i--){
        value = functions[i](value)
      }
      return value
  }
};


// MEDIUM
/*
Given a function fn, return a memoized version of that function.

A memoized function is a function that will never be called twice with the same inputs. Instead it will return a cached value.

You can assume there are 3 possible input functions: sum, fib, and factorial.

sum accepts two integers a and b and returns a + b. Assume that if a value has already been cached for the arguments (b, a) where a != b, it cannot be used for the arguments (a, b). For example, if the arguments are (3, 2) and (2, 3), two separate calls should be made.
fib accepts a single integer n and returns 1 if n <= 1 or fib(n - 1) + fib(n - 2) otherwise.
factorial accepts a single integer n and returns 1 if n <= 1 or factorial(n - 1) * n otherwise.

*/

// my answer

let callCount = 0;
function memoize(fn) {
    const memoMap = new Map()
    return function(...args) {
      if(!memoMap.get(`${args[0]}&${args[1]}`)){
        memoMap.set(`${args[0]}&${args[1]}`, fn(...args))
        callCount ++
        return fn(...args)
      }else{
        return memoMap.get(`${args[0]}&${args[1]}`)
      }
    }
}

const sum = (a, b) => a + b;
const memoizedSum = memoize(sum);
console.log(memoizedSum(2, 2))
console.log(memoizedSum(2, 2))
console.log(callCount)
console.log(memoizedSum(1, 2))
console.log(callCount)

// others answer
// 用 object 去除重複
// 這裡的 fn.apply(this, args) 與 fn(...args) 在功能上是相似的，apply 的差異在可以設定函式內的 this 值

function anotherMemoize(fn) {
    
  const cache = {};
  return function(...args) {
   const key = JSON.stringify(args);
   if (key in cache) {
     return cache[key];
   }
   
   const result = fn.apply(this, args);
   cache[key] = result;
   return result;
 }

}

