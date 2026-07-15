export const wait = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const HAS_REAL_BACKEND = Boolean(import.meta.env.VITE_API_URL);

function looksLikeRealData(data) {
  if (data == null) return false;
  if (typeof data === "string") return !/^\s*<(!doctype|html)/i.test(data);
  return true;
}

export async function withFallback(apiCall, mockValue, delay = 500) {
  if (!HAS_REAL_BACKEND) {
    await wait(delay);
    return mockValue;
  }
  try {
    const res = await apiCall();
    if (!looksLikeRealData(res.data))
      throw new Error("Unexpected response shape");
    return res.data;
  } catch {
    await wait(delay);
    return mockValue;
  }
}
