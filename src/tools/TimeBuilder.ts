export function getTimeString(time: number): string {
  const timeStr = time.toString();
  return timeStr.length == 1 ? `0${timeStr}` : timeStr;
}
export function getTimeCurrent(separator: string = ''): string {
  const now = new Date();

  const year = now.getUTCFullYear();
  const month = getTimeString(now.getUTCMonth() + 1);
  const date = getTimeString(now.getUTCDate());
  const hour = getTimeString(now.getUTCHours() + 1);
  const minute = getTimeString(now.getUTCMinutes() + 1);
  const second = getTimeString(now.getUTCSeconds() + 1);

  return `${year}${separator}${month}${separator}${date}${separator}${hour}${separator}${minute}${separator}${second}`;
}
