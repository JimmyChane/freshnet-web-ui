class TaskCommiter {
   static commit(param = {}) {
      const { counter, interval = 500 } = param;
      const { isLoading, setLoading, getData, setData, loadData } = param;

      if (counter.isValid()) return getData();

      return Promise.resolve()
         .then(
            () =>
               new Promise((resolve, reject) => {
                  const runnable = () => {
                     if (counter.isValid()) {
                        resolve(getData());
                     } else if (isLoading()) {
                        setTimeout(runnable, interval);
                     } else {
                        counter.resetCheckpoint();
                        setLoading(true);
                        setData(null);
                        loadData()
                           .then((data) => resolve(data))
                           .catch((error) => reject(error));
                     }
                  };
                  runnable();
               })
         )
         .then((data) => {
            setData(data);
            setLoading(false);
            counter.makeCheckpoint();
            return getData();
         })
         .catch((error) => {
            counter.resetCheckpoint();
            setLoading(false);
            setData(null);
            throw error;
         })
         .finally(() => {
            setLoading(false);
         });
   }
}

module.exports = TaskCommiter;
