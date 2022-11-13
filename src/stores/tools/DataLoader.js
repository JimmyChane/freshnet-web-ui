import ValidationChecker from "./ValidationChecker";

class DataLoader {
	$validator;

	$getProcessor;

	$loadData;
	$setData;
	$getData;

	constructor(arg = { timeout: 1000 * 60 * 10 }) {
		this.$validator = new ValidationChecker({ timeout: arg.timeout });
	}

	processor(callback) {
		this.$getProcessor = callback;
		return this;
	}

	loadData(callback) {
		this.$loadData = callback;
		return this;
	}
	setData(callback) {
		this.$setData = callback;
		return this;
	}
	getData(callback) {
		this.$getData = callback;
		return this;
	}

	doTimeout() {
		this.$validator.resetCheckpoint();
	}
	isTimeout() {
		return !this.$validator.isValid();
	}

	data() {
		const validator = this.$validator;

		const processor = this.$getProcessor();

		const getData = this.$getData;
		const setData = this.$setData;
		const loadData = this.$loadData;

		return processor.acquire("DataLoader", async () => {
			try {
				if (validator.isValid()) return getData();

				const data = await new Promise((resolve, reject) => {
					validator.resetCheckpoint();
					setData(null);
					loadData()
						.then((data) => resolve(data))
						.catch((error) => reject(error));
				});

				setData(data);
				validator.makeCheckpoint();
				return getData();
			} catch (error) {
				validator.resetCheckpoint();
				setData(null);
				throw error;
			}
		});
	}
}

export default DataLoader;
