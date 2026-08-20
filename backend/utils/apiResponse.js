export function sendSuccess(
  res,
  { statusCode = 200, message = "Success", data = null, meta } = {},
) {
  const body = { success: true, message, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
}

export function sendError(
  res,
  { statusCode = 500, message = "Something went wrong", errors = [] } = {},
) {
  return res.status(statusCode).json({ success: false, message, errors });
}
