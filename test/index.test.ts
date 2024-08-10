import { delayFn, constantFn, genFn, wrapFn, cacheFn } from '../src';
describe('Functions', () => {
    
    // Tests for delayFn
    describe('delayFn', () => {
        beforeAll(() => {
            jest.useFakeTimers();
        });

        afterAll(() => {
            jest.useRealTimers();
        });
        
        it('should delay the execution of the function', () => {
            const mockFn = jest.fn();
            const delayedFn = delayFn(mockFn, 1000);
            
            delayedFn('test');
            expect(mockFn).not.toHaveBeenCalled();
            
            jest.advanceTimersByTime(1000);
            expect(mockFn).toHaveBeenCalledWith('test');
        });
    });
    
    // Tests for constantFn
    describe('constantFn', () => {
        it('should return a function that returns a fixed value', () => {
            const constantFive = constantFn(5);
            expect(constantFive()).toBe(5);
        });

        it('should return the same value every time the function is called', () => {
            const constantValue = constantFn('hello');
            expect(constantValue()).toBe('hello');
            expect(constantValue()).toBe('hello');
        });
    });
    
    // Tests for genFn
    describe('genFn', () => {
        it('should create a function from a string template', () => {
            const sumFn = genFn('a + b', { a: 2, b: 3 });
            expect(sumFn()).toBe(5);
        });

        it('should create a function that uses the provided context', () => {
            const multiplyFn = genFn('a * b', { a: 4, b: 5 });
            expect(multiplyFn()).toBe(20);
        });
    });
    
// Tests for wrapFn
describe('wrapFn', () => {
    it('should wrap a function with additional behavior', () => {
        const originalFn = (a: number, b: number) => a + b;
        const wrappedFn = wrapFn(originalFn, (next, _thisArg, a, b) => {
            return next(a * 2, b * 2);
        });

        expect(wrappedFn(1, 2)).toBe(6); // (1*2) + (2*2) = 6
    });

    it('should have access to the this context in the wrapper', () => {
        const obj = {
            factor: 2,
            multiply(a: number, b: number) {
                return a * b * this.factor;
            }
        };

        const wrappedMultiply = wrapFn(obj.multiply, (next, _thisArg, a, b) => {
            return next(a + 1, b + 1); // modify input values
        });

        expect(wrappedMultiply.call(obj, 2, 3)).toBe(24); // (2+1) * (3+1) * 2 = 24
    });
});

    // Tests for cacheFn
    describe('cacheFn', () => {
        it('should cache the result of a function', () => {
            const mockFn = jest.fn((x: number) => x * 2);
            const cachedFn = cacheFn(mockFn);

            expect(cachedFn(2)).toBe(4);
            expect(mockFn).toHaveBeenCalledTimes(1);

            // Call again with the same argument
            expect(cachedFn(2)).toBe(4);
            expect(mockFn).toHaveBeenCalledTimes(1); // Should still be called only once
        });

        it('should compute result again for different arguments', () => {
            const mockFn = jest.fn((x: number) => x * 2);
            const cachedFn = cacheFn(mockFn);

            expect(cachedFn(2)).toBe(4);
            expect(cachedFn(3)).toBe(6);
            expect(mockFn).toHaveBeenCalledTimes(2);
        });
    });
});
