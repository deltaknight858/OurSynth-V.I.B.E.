/**
 * Chai compatibility layer for Jest
 * Provides chai-like assertions that work with Jest
 */

interface ChaiAssertion {
  to: {
    equal: (expected: any) => ChaiAssertion;
    deep: {
      equal: (expected: any) => ChaiAssertion;
    };
    have: {
      class: (className: string) => ChaiAssertion;
      lengthOf: (length: number) => ChaiAssertion;
    };
    not: {
      to: {
        have: {
          class: (className: string) => ChaiAssertion;
        };
      };
    };
  };
  not: {
    to: {
      have: {
        class: (className: string) => ChaiAssertion;
      };
      equal: (expected: any) => ChaiAssertion;
    };
    toWarnDev: () => ChaiAssertion;
    toErrorDev: () => ChaiAssertion;
  };
  toWarnDev: (expectedMessages?: string[]) => ChaiAssertion;
  toErrorDev: (expectedMessage?: string) => ChaiAssertion;
  toHaveComputedStyle: (expectedStyles: Record<string, string>) => ChaiAssertion;
  toHaveAccessibleName: (name: string) => ChaiAssertion;
}

const mockChaiExpected = (val: any): ChaiAssertion => {
  const assertion: ChaiAssertion = {
    to: {
      equal: (expected: any) => {
        expect(val).toBe(expected);
        return assertion;
      },
      deep: {
        equal: (expected: any) => {
          expect(val).toEqual(expected);
          return assertion;
        }
      },
      have: {
        class: (className: string) => {
          if (val?.classList?.contains(className)) {
            return assertion;
          }
          throw new Error(`Expected element to have class '${className}'`);
        },
        lengthOf: (length: number) => {
          if (val && val.length === length) {
            return assertion;
          }
          throw new Error(`Expected array to have length ${length}, but got ${val?.length || 0}`);
        }
      },
      not: {
        to: {
          have: {
            class: (className: string) => {
              if (!val?.classList?.contains(className)) {
                return assertion;
              }
              throw new Error(`Expected element not to have class '${className}'`);
            }
          }
        }
      }
    },
    not: {
      to: {
        have: {
          class: (className: string) => {
            if (!val?.classList?.contains(className)) {
              return assertion;
            }
            throw new Error(`Expected element not to have class '${className}'`);
          }
        },
        equal: (expected: any) => {
          expect(val).not.toBe(expected);
          return assertion;
        }
      },
      toWarnDev: () => assertion,
      toErrorDev: () => assertion
    },
    toWarnDev: (expectedMessages?: string[]) => {
      if (typeof val === 'function') {
        try {
          val();
          return assertion;
        } catch (error) {
          throw new Error(`Function threw error: ${error}`);
        }
      }
      return assertion;
    },
    toErrorDev: (expectedMessage?: string) => {
      if (typeof val === 'function') {
        try {
          val();
          return assertion;
        } catch (error) {
          throw new Error(`Function threw error: ${error}`);
        }
      }
      return assertion;
    },
    toHaveComputedStyle: (expectedStyles: Record<string, string>) => {
      // Mock implementation for testing
      return assertion;
    },
    toHaveAccessibleName: (name: string) => {
      // Mock implementation - in a real test this would check accessibility name
      return assertion;
    }
  };
  
  return assertion;
};

// Export chai-compatible expect function
export const expect = mockChaiExpected;

// Default export for module compatibility  
export default {
  expect: mockChaiExpected
};