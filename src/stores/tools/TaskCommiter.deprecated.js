class TaskCommiter {
   static async commit(param = {}) {
      const { counter, interval = 500 } = param;
      const { isLoading, setLoading, getData, setData, loadData } = param;

      if (counter.isValid()) {
         return getData();
      }
      while (isLoading()) {
         await new Promise((resolve) => setTimeout(resolve, interval));
      }

      try {
         setLoading(true);
         setData(null);

         const data = await loadData();
         setData(data);
         counter.makeCheckpoint();
         return getData();
      } catch (error) {
         counter.resetCheckpoint();
         setData(null);
         throw error;
      } finally {
         setLoading(false);
      }
   }
}

module.exports = TaskCommiter;
