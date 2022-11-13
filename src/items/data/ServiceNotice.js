class ServiceNotice {
   static trim(data) {
      return new ServiceNotice(data);
   }

   constructor(data = null) {
      this.isUrgent = data.isUrgent ? true : false;
      this.isWarranty = data.isWarranty ? true : false;
   }
}

module.exports = ServiceNotice;
