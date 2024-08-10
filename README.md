
# `genfunc`

This library provides a collection of high-performance, framework-agnostic functions designed to simplify common programming tasks. Whether you need to create functions from string templates, delay function execution, cache results, or wrap functions with additional behavior, this library offers a flexible and easy-to-use solution.

**Table of Contents:**

- [`genfunc`](#genfunc)
  - [`genFn`](#genfn)
  - [`wrapFn`](#wrapfn)
  - [`cacheFn`](#cachefn)
  - [`delayFn`](#delayfn)
  - [`constantFn`](#constantfn)
  - [Usage Examples](#usage-examples)
  - [Summary Table](#summary-table)

## `genFn`

**Description:**

Creates a function from a string template. The function is dynamically generated from the provided template and bound to an optional context object.

**Parameters:**

- **`template`**: `string`  
  The function template as a string. This string should be a valid JavaScript expression or block of code.

- **`context`**: `Record<string, any>` (optional)  
  An optional context object to bind to the created function.

**Returns:**

- **`Function`**  
  The created function.

**Basic Usage:**

```javascript
const sumFn = genFn('a + b', { a: 2, b: 3 });
console.log(sumFn()); // Output: 5
```

**Using Context:**

```javascript
const multiplier = genFn('a * b', { a: 4, b: 5 });
console.log(multiplier()); // Output: 20
```

## `wrapFn`

**Description:**

Creates a function that wraps the provided function with additional behavior. The wrapper function can modify the arguments, `this` context, or the return value of the original function.

**Parameters:**

- **`func`**: `Function`  
  The function to wrap.

- **`wrapper`**: `Function`  
  The wrapper function that takes the original function as its first argument and allows additional behavior. It has the signature:
  
  ```typescript
  (next: (...args: Parameters<T>) => ReturnType<T>, thisArg: unknown, ...args: Parameters<T>) => ReturnType<T>
  ```

**Returns:**

- **`Function`**  
  The wrapped function.

**Wrapping a Function:**

```javascript
const originalFn = (a, b) => a + b;
const wrappedFn = wrapFn(originalFn, (next, thisArg, a, b) => {
    return next(a * 2, b * 2);
});

console.log(wrappedFn(1, 2)); // Output: 6 (1*2 + 2*2)
```

**Accessing `this` Context:**

```javascript
const obj = {
    factor: 2,
    multiply(a, b) {
        return a * b * this.factor;
    }
};

const wrappedMultiply = wrapFn(obj.multiply, (next, thisArg, a, b) => {
    return next(a + 1, b + 1);
});

console.log(wrappedMultiply.call(obj, 2, 3)); // Output: 24 ((2+1) * (3+1) * 2)
```

## `cacheFn`

**Description:**

Creates a function that caches the results of the original function based on the arguments provided. This is useful for memoizing expensive computations.

**Parameters:**

- **`func`**: `Function`  
  The function to cache.

**Returns:**

- **`Function`**  
  The cached function.

**Basic Caching:**

```javascript
const expensiveFn = (x) => x * 2;
const cachedFn = cacheFn(expensiveFn);

console.log(cachedFn(2)); // Output: 4
console.log(cachedFn(2)); // Output: 4 (cached result)
```

**Caching with Different Arguments:**

```javascript
const expensiveFn = (x) => x * 2;
const cachedFn = cacheFn(expensiveFn);

console.log(cachedFn(2)); // Output: 4
console.log(cachedFn(3)); // Output: 6
```

## `delayFn`

**Description:**

Creates a function that delays the execution of the provided function by a specified number of milliseconds.

**Parameters:**

- **`func`**: `Function`  
  The function to delay.

- **`delay`**: `number`  
  The delay in milliseconds.

**Returns:**

- **`Function`**  
  The delayed function.

**Basic Delay:**

```javascript
const mockFn = jest.fn();
const delayedFn = delayFn(mockFn, 1000);

delayedFn('test');
expect(mockFn).not.toHaveBeenCalled();

jest.advanceTimersByTime(1000);
expect(mockFn).toHaveBeenCalledWith('test');
```

## `constantFn`

**Description:**

Creates a function that returns a fixed value.

**Parameters:**

- **`value`**: `T`  
  The fixed value to return.

**Returns:**

- **`Function`**  
  The function that returns the fixed value.

**Returning a Fixed Value:**

```javascript
const constantFive = constantFn(5);
console.log(constantFive()); // Output: 5

const constantString = constantFn('hello');
console.log(constantString()); // Output: 'hello'
```

## Usage Examples

Here's a summary of how to use all the provided functions:

```javascript
// genFn
const sumFn = genFn('a + b', { a: 5, b: 10 });
console.log(sumFn()); // Output: 15

// wrapFn
const addFn = (a, b) => a + b;
const wrappedAdd = wrapFn(addFn, (next, _thisArg, a, b) => next(a * 2, b * 2));
console.log(wrappedAdd(1, 2)); // Output: 6

// cacheFn
const computeFn = (x) => x * 3;
const cachedCompute = cacheFn(computeFn);
console.log(cachedCompute(4)); // Output: 12
console.log(cachedCompute(4)); // Output: 12 (cached)

// delayFn
const delayedFn = delayFn(() => console.log('Delayed'), 500);
delayedFn(); // Will log 'Delayed' after 500ms

// constantFn
const getNumber = constantFn(42);
console.log(getNumber()); // Output: 42
```

## Summary Table

| Function      | Description                                         | Parameters                                                                 | Returns         | Example Usage                        |
|---------------|-----------------------------------------------------|----------------------------------------------------------------------------|-----------------|--------------------------------------|
| `genFn`       | Creates a function from a string template.         | `template: string`, `context?: Record<string, any>`                          | `Function`      | `genFn('a + b', { a: 5, b: 10 })`    |
| `wrapFn`      | Wraps a function with additional behavior.         | `func: Function`, `wrapper: Function`                                       | `Function`      | `wrapFn(fn, wrapper)`                |
| `cacheFn`     | Caches results of a function based on arguments.   | `func: Function`                                                            | `Function`      | `cacheFn(fn)`                        |
| `delayFn`     | Delays the execution of a function.                | `func: Function`, `delay: number`                                           | `Function`      | `delayFn(fn, 1000)`                  |
| `constantFn`  | Creates a function that returns a fixed value.     | `value: T`                                                                   | `Function`      | `constantFn(42)`                     |
