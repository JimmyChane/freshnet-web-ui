class ServiceNotice {
   static trim(data) {
      return new ServiceNotice(data);
   }

   constructor(data = null) {
      this.isUrgent = !!data.isUrgent;
      this.isWarranty = !!data.isWarranty;
   }
}

module.exports = ServiceNotice;
