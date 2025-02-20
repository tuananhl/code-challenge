/**
 * =========== ASSUMING ==========
 * === This input will always produce a result lesser than Number.MAX_SAFE_INTEGER
 * === n is not Infinity
 * === In case of the `n` param is negative. the calculation will run from n to -1.
 * === In case of the value of n is 0. we return 0 directly
 */

/**
 * Extra method for formatting the result.
 */
function formatResult(result: number, originalIsNegative: boolean) {
  return result * (originalIsNegative ? -1 : 1);
}

/**
 * Formula approach
 * Time complexity: O(1). using a calculation with a constant time
 * Space complexity: O(1). 
 * @param n { Number }
 * @returns Number
 */
function sum_to_n_a(n: number): number {
  const m = Math.abs(n);
  const formula = (m * (m + 1)) / 2; // Formula divides by 2. we can use bitwise like >> 1 instead of /2
  return formatResult(formula, n < 0);
}

/**
 * Normal loop approach. Loop from 0 to n and sum all the number values.
 * Time complexity: O(n)
 * Space complexity: O(1). No extra space require
 * @param n { Number }
 * @returns Number
 */
function sum_to_n_b(n: number): number {
  let total = 0;
  for (let i = 1; i <= Math.abs(n); i += 1) {
    total += i;
  }
  return formatResult(total, n < 0);
}


/**
 * Recursive approach
 * Time complexity: O(n). the function is called recursively n time
 * Space complexity: O(n). each time function is called, it used stack space.
 * @param n { Number }
 * @returns Number
 */
function sum_to_n_c(n: number): number {
  if (n === 0) return 0;
  return n + sum_to_n_c(n - (n < 0 ? -1 : 1));
}

/**
 * ============ TEST CASE =============
 */

console.log('======== Test for sum_to_n_a method');
console.log(`When n is a positive number as sum_to_n_a(5) expects 15 and result is ${sum_to_n_a(5)}`);
console.log(`When n is a negative number as sum_to_n_a(-5) expects -15 and result is ${sum_to_n_a(-5)}`);
console.log(`When n is 0 as sum_to_n_a(0) expected 0 and result is ${sum_to_n_a(0)}`);
console.log('======== End test for sum_to_n_a method');


console.log('======== Test for sum_to_n_b method');
console.log(`When n is a positive number as sum_to_n_b(5) expects 15 and result is ${sum_to_n_b(5)}`);
console.log(`When n is a negative number as sum_to_n_b(-5) expects -15 and result is ${sum_to_n_b(-5)}`);
console.log(`When n is 0 as sum_to_n_b(0) expected 0 and result is ${sum_to_n_b(0)}`);
console.log('======== End test for sum_to_n_b method');


console.log('======== Test for sum_to_n_c method');
console.log(`When n is a positive number as sum_to_n_c(5) expects 15 and result is ${sum_to_n_c(5)}`);
console.log(`When n is a negative number as sum_to_n_c(-5) expects -15 and result is ${sum_to_n_c(-5)}`);
console.log(`When n is 0 as sum_to_n_c(0) expected 0 and result is ${sum_to_n_c(0)}`);
console.log('======== End test for sum_to_n_c method');
