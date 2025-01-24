import { API, Response } from '@/host/ServerApi';

export async function getSettingList() {
  const response = await API.get('settingv3');

  const json = response.data;
  const hostResponse = new Response(json);
  const hostError = hostResponse.getError();
  if (hostError) {
    throw new Error(hostError);
  }

  return hostResponse;
}
export async function updateSetting(setting: any) {
  const response = await API.put('settingv3/system', setting);
  return new Response(response.data);
}
