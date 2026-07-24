import { get } from './http.js';

const userCache = new Map();

function get_user_by_id(user_id, { signal } = {}) {
  if (user_id === undefined || user_id === null) {
    return Promise.resolve(null);
  }

  const key = String(user_id);

  if (userCache.has(key)) {
    return userCache.get(key);
  }

  const pending = get(`/api/users/${user_id}`, { signal }).catch((error) => {
    userCache.delete(key);
    throw error;
  });

  userCache.set(key, pending);

  return pending;
}

function clear_users_cache() {
  userCache.clear();
}

export { get_user_by_id, clear_users_cache };
