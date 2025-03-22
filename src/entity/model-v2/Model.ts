export abstract class Model {
  abstract getUnique(): string;

  toCount(strs: string[]): number {
    return 0;
  }
}
