import { API, ServerResponse } from '@/entity/Server';

export async function getSettingList() {
  const response = await API.get('settingv3');

  const json = response.data;
  const hostResponse = new ServerResponse(json);
  const hostError = hostResponse.getError();
  if (hostError) {
    throw new Error(hostError);
  }

  return hostResponse;
}
export async function updateSetting(setting: any) {
  const response = await API.put('settingv3/system', setting);
  return new ServerResponse(response.data);
}
