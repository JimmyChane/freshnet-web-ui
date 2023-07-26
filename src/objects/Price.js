class Price {
    static DefaultCurrency = "RM";
    static parse(any) {
        if (any instanceof Price)
            return any;
        if (typeof any === "number")
            return new Price(any);
        if (typeof any === "string") {
            const currencyParses = [];
            const amountParsed = this.parseAmount(any);
            while (true) {
                let currencyParsed = this.parseCurrency(any);
                if (!currencyParsed.value)
                    break;
                currencyParses.push(currencyParsed);
                any = any.substring(currencyParsed.indexEnd, any.length);
            }
            return new Price(amountParsed, currencyParses.length ? currencyParses[0].value : "");
        }
        return new Price();
    }
    static parseCurrency(content) {
        const indexStart = content.indexOf(this.DefaultCurrency);
        const indexEnd = indexStart === -1 ? -1 : indexStart + this.DefaultCurrency.length;
        return {
            indexStart,
            indexEnd,
            value: indexStart === -1 ? "" : content.substring(indexStart, indexEnd),
        };
    }
    static parseAmount(content) {
        let valueString = "";
        let hasNumberFront = false;
        let hasNumberBack = false;
        let hasDot = false;
        for (let i = 0; i < content.length; i++) {
            let char = content.charAt(i);
            if (char === " ") {
                if (hasDot || hasNumberFront || hasNumberBack)
                    break;
                continue;
            }
            let parse = Number.parseInt(char);
            if (!Number.isNaN(parse)) {
                valueString += parse;
                if (hasDot)
                    hasNumberBack = true;
                else
                    hasNumberFront = true;
                continue;
            }
            if (char === ".") {
                if (hasDot)
                    break;
                valueString += ".";
                hasDot = true;
                continue;
            }
        }
        const valueParse = Number.parseFloat(valueString);
        return Number.isNaN(valueParse) ? 0 : valueParse;
    }
    _amount;
    _currency;
    constructor(amount = 0, currency = "RM") {
        this._currency =
            currency.trim().replace(" ", "").toUpperCase() || Price.DefaultCurrency;
        this._amount = isNaN(amount) ? 0 : Number(amount);
    }
    get amount() {
        return this._amount;
    }
    get currency() {
        return this._currency;
    }
    compare(item) {
        return this._amount - item._amount;
    }
    plus(any) {
        const price = Price.parse(any);
        return new Price(this._amount + price._amount, this._currency);
    }
    minus(any) {
        const price = Price.parse(any);
        return new Price(this._amount - price._amount, this._currency);
    }
    toString() {
        const { amount, currency } = this;
        let text = amount.toFixed(2);
        let dotIndex = text.indexOf(".") - 3;
        let minusIndex = text.indexOf("-") + 1;
        while (dotIndex > minusIndex) {
            const part1 = `${text.substring(0, dotIndex)}`;
            const part2 = `${text.substring(dotIndex, text.length)}`;
            text = `${part1},${part2}`;
            dotIndex = dotIndex - 3;
        }
        return currency ? `${currency} ${text}` : `${text}`;
    }
    toCount(strs) {
        return strs.reduce((count, str) => {
            if (this.toString().includes(str)) {
                return count + 1;
            }
            return count;
        }, 0);
    }
}
export default Price;
