export const wait = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const HAS_REAL_BACKEND = Boolean(import.meta.env.VITE_API_URL);

function looksLikeRealData(data) {
  if (data == null) return false;
  if (typeof data === "string") return !/^\s*<(!doctype|html)/i.test(data);
  return true;
}

function unwrapEnvelope(body) {
  if (body && typeof body === "object" && "success" in body && "data" in body) {
    return body.data;
  }
  return body;
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
    return unwrapEnvelope(res.data);
  } catch {
    await wait(delay);
    return mockValue;
  }
}

export async function withFallbackPaginated(apiCall, mockValue, delay = 500) {
  if (!HAS_REAL_BACKEND) {
    await wait(delay);
    return { items: mockValue, meta: null };
  }
  try {
    const res = await apiCall();
    if (!looksLikeRealData(res.data))
      throw new Error("Unexpected response shape");
    const body = res.data;
    const isEnvelope =
      body && typeof body === "object" && "success" in body && "data" in body;
    return {
      items: isEnvelope ? body.data : body,
      meta: isEnvelope ? body.meta || null : null,
    };
  } catch {
    await wait(delay);
    return { items: mockValue, meta: null };
  }
}
