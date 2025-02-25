import { API, ServerResponse } from '@/entity/Server';

export async function getUserList() {
  const response = await API.get('users');
  return new ServerResponse(response.data);
}
export async function addUser(
  username: string,
  name: string,
  passwordNew: string,
  passwordRepeat: string,
) {
  const response = await API.post('users/user', {
    username,
    name,
    passwordNew,
    passwordRepeat,
  });
  return new ServerResponse(response.data);
}
export async function removeUser(username: string) {
  const response = await API.delete('users/user', { data: { username } });
  return new ServerResponse(response.data);
}
export async function updateUser(username: string, userType: string) {
  const response = await API.put('users/user', { username, userType });
  return new ServerResponse(response.data);
}
