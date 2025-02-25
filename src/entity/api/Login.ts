import { API, ServerResponse } from '@/entity/Server';

export async function loginUser(body: any) {
  const reponse = await API.post('session/login/', body);
  return new ServerResponse(reponse.data);
}
export async function getUser(token: string) {
  const response = await API.post('session/verifyToken/', { token });
  return new ServerResponse(response.data);
}
export async function updateUserPassword(
  username: string,
  passwordVerify: string,
  passwordNew: string,
) {
  const response = await API.post(`session/user/${username}/changePassword`, {
    passwordVerify,
    passwordNew,
  });
  return new ServerResponse(response.data);
}
