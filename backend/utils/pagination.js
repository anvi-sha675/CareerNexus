import { PAGINATION_DEFAULTS } from "../constants/index.js";

export function parsePagination(query) {
  let page = parseInt(query.page, 10) || PAGINATION_DEFAULTS.PAGE;
  let limit = parseInt(query.limit, 10) || PAGINATION_DEFAULTS.LIMIT;
  page = Math.max(page, 1);
  limit = Math.min(Math.max(limit, 1), PAGINATION_DEFAULTS.MAX_LIMIT);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildMeta({ page, limit, total }) {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(Math.ceil(total / limit), 1),
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
  };
}
