class TrackListener {
   #onStart;
   #onEnd;

   constructor(arg = {}) {
      this.#onStart = arg?.onStart;
      this.#onEnd = arg?.onEnd;
   }

   tellStart(track) {
      if (typeof this.#onStart === "function") {
         this.#onStart(track);
      }
   }
   tellEnd(track) {
      if (typeof this.#onEnd === "function") {
         this.#onEnd(track);
      }
   }
}

class Track {
   #context;
   #key;

   #listeners = [];
   #isStarted = false;
   #isEnded = false;

   get key() {
      return this.#key;
   }

   constructor(context, key) {
      this.#context = context;
      this.#key = key;
   }

   registerListener(listener) {
      let found = this.#listeners.find((lis) => lis === listener);
      if (!found) this.#listeners.push(listener);
      return this;
   }
   unregisterListener(listener) {
      let found = this.#listeners.find((lis) => lis === listener);
      if (found) this.#listeners.splice(this.#listeners.indexOf(found));
      return this;
   }
   isTracking() {
      return !!this.#context.tracks.find((track) => track.key === this.key);
   }
   start() {
      let runnable;
      return new Promise(
         (runnable = (resolve, reject) => {
            if (this.#isStarted) {
               reject();
               return;
            }
            if (this.isTracking()) {
               setTimeout(() => runnable(resolve, reject), 1000);
               return;
            }

            this.#context.tracks.push(this);
            this.#isStarted = true;
            for (let i = 0; i < this.#listeners.length; i++) {
               this.#listeners[i].tellStart(this);
            }
            resolve(this);
         })
      );
   }
   end() {
      return new Promise((resolve, reject) => {
         if (this.#isEnded) {
            reject();
            return;
         }
         // this.#context.tracks.splice(this.#context.tracks.indexOf(this));
         this.#isEnded = true;
         for (let i = 0; i < this.#listeners.length; i++) {
            this.#listeners[i].tellEnd(this);
         }

         resolve(this);
      });
   }
}

class DataLoadingTracker {
   static TrackListener = TrackListener;
   static Track = Track;

   #tracks = [];

   get tracks() {
      return this.#tracks;
   }

   isTracking(key) {
      for (let i = 0; i < this.tracks.length; i++) {
         if (tracks[i].key === key) return true;
      }
      return false;
   }
   hasTracks() {
      return !!this.tracks.length;
   }
   createTrack(key) {
      return new Track(this, key);
   }
}

export default DataLoadingTracker;
