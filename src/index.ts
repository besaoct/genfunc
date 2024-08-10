/**
 * Creates a function from a string template.
 * @param {string} template - The function template as a string.
 * @param {object} [context={}] - An optional context object to bind.
 * @returns {Function} - The created function.
 */
export function genFn(template: string, context: Record<string, any> = {}): Function {
    const funcBody = `with(this) { return ${template}; }`;
    return new Function(funcBody).bind(context);
}

/**
 * Creates a function that wraps the provided function with additional behavior.
 * @param {Function} func - The function to wrap.
 * @param {(next: (...args: Parameters<T>) => ReturnType<T>, thisArg: unknown, ...args: Parameters<T>) => ReturnType<T>} wrapper - The wrapper function that takes the original function as its first argument.
 * @returns {Function} - The wrapped function.
 */
export function wrapFn<T extends (...args: any[]) => any>(
    func: T,
    wrapper: (
        next: (...args: Parameters<T>) => ReturnType<T>,
        thisArg: unknown,
        ...args: Parameters<T>
    ) => ReturnType<T>
): T {
    return function (this: any, ...args: Parameters<T>): ReturnType<T> {
        return wrapper(
            (...wrappedArgs: Parameters<T>) => func.apply(this, wrappedArgs),
            this,
            ...args
        );
    } as T;
}

/**
 * Creates a function that caches the results of the original function.
 * @param {Function} func - The function to cache.
 * @returns {Function} - The cached function.
 */
export function cacheFn<T extends (...args: any[]) => any>(func: T): T {
    const cache = new Map<string, ReturnType<T>>();
    return function (...args: Parameters<T>): ReturnType<T> {
        const key = JSON.stringify(args);
        if (!cache.has(key)) {
            cache.set(key, func(...args));
        }
        return cache.get(key) as ReturnType<T>;
    } as T;
}

/**
 * Creates a function that delays the execution of the provided function.
 * @param {Function} func - The function to delay.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Function} - The delayed function.
 */
export function delayFn<T extends (...args: any[]) => void>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    return function (this: unknown, ...args: Parameters<T>): void {
        setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Creates a function that returns a fixed value.
 * @param {T} value - The fixed value to return.
 * @returns {Function} - The function that returns the fixed value.
 */
export function constantFn<T>(value: T): () => T {
    return function (): T {
        return value;
    };
}


