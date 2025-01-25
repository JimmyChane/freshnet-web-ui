import { API, Response } from '@/host/ServerApi';

export async function getUserList() {
  const response = await API.get('users');
  return new Response(response.data);
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
  return new Response(response.data);
}
export async function removeUser(username: string) {
  const response = await API.delete('users/user', { data: { username } });
  return new Response(response.data);
}
export async function updateUser(username: string, userType: string) {
  const response = await API.put('users/user', { username, userType });
  return new Response(response.data);
}
