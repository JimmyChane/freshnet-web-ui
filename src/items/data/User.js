const Text = require("./Text.js");

class User {
   static Type = { None: -1, Admin: 0, Staff: 1, Customer: 2 };
   static ReservedUsername = { Admin: "admin", Staff: "staff" };

   static trim(data) {
      return new User(data);
   }
   static isDefaultUser(item) {
      const { username, userType } = item;
      const isDefaultAdmin =
         username === this.ReservedUsername.Admin &&
         userType === this.Type.Admin;
      const isDefaultStaff =
         username === this.ReservedUsername.Staff &&
         userType === this.Type.Staff;
      return isDefaultAdmin || isDefaultStaff;
   }

   constructor(data = null) {
      this.username = Text.trim(data.username, "").replace(" ", "");
      this.name = Text.trim(data.name, "");
      this.userType = data.userType;
   }
}

module.exports = User;
