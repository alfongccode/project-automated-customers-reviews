function get_user_by_id(user_id) {
  return fetch(`/api/users/${user_id}`).then((response) => response.json());
}

export { get_user_by_id };
