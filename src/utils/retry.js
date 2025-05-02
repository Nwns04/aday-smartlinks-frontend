// src/utils/retry.js
export async function retry(fn, retries = 3, delay = 300) {
    try {
      return await fn();
    } catch (err) {
      if (retries <= 1) throw err;
      await new Promise(res => setTimeout(res, delay));
      return retry(fn, retries - 1, delay * 2);
    }
  }
  