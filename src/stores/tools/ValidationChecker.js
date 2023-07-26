export default class ValidationChecker {
    _timeout = 0;
    _checkpoint = 0;
    constructor(param) {
        this._timeout = param.timeout;
    }
    get timeout() {
        return this._timeout;
    }
    get checkpoint() {
        return this._checkpoint;
    }
    isValid() {
        return Date.now() - this._checkpoint < this._timeout;
    }
    makeCheckpoint() {
        this._checkpoint = Date.now();
    }
    resetCheckpoint() {
        this._checkpoint = 0;
    }
}
