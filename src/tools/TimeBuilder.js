module.exports = {
   getString(time) {
      time = time.toString();
      return time.length == 1 ? `0${time}` : time;
   },
   getCurrent(separator = "") {
      const now = new Date();

      const year = now.getUTCFullYear();
      const month = this.getString(now.getUTCMonth() + 1);
      const date = this.getString(now.getUTCDate());
      const hour = this.getString(now.getUTCHours() + 1);
      const minute = this.getString(now.getUTCMinutes() + 1);
      const second = this.getString(now.getUTCSeconds() + 1);

      return `${year}${separator}${month}${separator}${date}${separator}${hour}${separator}${minute}${separator}${second}`;
   },
};
