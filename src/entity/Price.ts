export const DEFAULT_CURRENCY = 'RM';

export function parsePrice(any: Price | number | string | any): Price {
  if (any instanceof Price) return any;
  if (typeof any === 'number') return new Price(any);
  if (typeof any === 'string') {
    const currencyParses = [];
    const amountParsed = parseAmount(any);

    while (true) {
      let currencyParsed = parseCurrency(any);
      if (!currencyParsed.value) break;
      currencyParses.push(currencyParsed);
      any = any.substring(currencyParsed.indexEnd, any.length);
    }

    return new Price(
      amountParsed,
      currencyParses.length ? currencyParses[0].value : '',
    );
  }

  return new Price();
}
function parseCurrency(content: string): {
  indexStart: number;
  indexEnd: number;
  value: string;
} {
  const indexStart = content.indexOf(DEFAULT_CURRENCY);
  const indexEnd =
    indexStart === -1 ? -1 : indexStart + DEFAULT_CURRENCY.length;
  return {
    indexStart,
    indexEnd,
    value: indexStart === -1 ? '' : content.substring(indexStart, indexEnd),
  };
}
function parseAmount(content: string): number {
  let valueString = '';
  let hasNumberFront = false;
  let hasNumberBack = false;
  let hasDot = false;
  for (let i = 0; i < content.length; i++) {
    let char = content.charAt(i);

    if (char === ' ') {
      if (hasDot || hasNumberFront || hasNumberBack) break;
      continue;
    }

    let parse = Number.parseInt(char);
    if (!Number.isNaN(parse)) {
      valueString += parse;
      if (hasDot) hasNumberBack = true;
      else hasNumberFront = true;
      continue;
    }

    if (char === '.') {
      if (hasDot) break;
      valueString += '.';
      hasDot = true;
      continue;
    }
  }

  const valueParse = Number.parseFloat(valueString);

  return Number.isNaN(valueParse) ? 0 : valueParse;
}

export class Price {
  readonly amount: number;
  readonly currency: string;

  constructor(amount: number = 0, currency: string = 'RM') {
    this.currency =
      currency.trim().replace(' ', '').toUpperCase() || DEFAULT_CURRENCY;
    this.amount = isNaN(amount) ? 0 : Number(amount);
  }

  compare(item: Price): number {
    return this.amount - item.amount;
  }

  plus(any: Price | number | string | any): Price {
    const price = parsePrice(any);
    return new Price(this.amount + price.amount, this.currency);
  }

  minus(any: Price | number | string | any): Price {
    const price = parsePrice(any);
    return new Price(this.amount - price.amount, this.currency);
  }

  toString(): string {
    const { amount, currency } = this;

    let text = amount.toFixed(2);
    let dotIndex = text.indexOf('.') - 3;
    let minusIndex = text.indexOf('-') + 1;
    while (dotIndex > minusIndex) {
      const part1 = `${text.substring(0, dotIndex)}`;
      const part2 = `${text.substring(dotIndex, text.length)}`;

      text = `${part1},${part2}`;
      dotIndex = dotIndex - 3;
    }

    return currency ? `${currency} ${text}` : `${text}`;
  }

  toCount(strs: string[]): number {
    return strs.reduce((count, str) => {
      if (this.toString().includes(str)) {
        return count + 1;
      }
      return count;
    }, 0);
  }
}
