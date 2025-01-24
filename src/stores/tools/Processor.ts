export default class Processor {
  private keys: string[] = [];

  private async add(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const run = (): void => {
        if (this.isLoading(key)) {
          setTimeout(run, 10);
          return;
        }
        this.keys.push(key);
        resolve(key);
      };
      run();
    });
  }

  private remove(key: string): void {
    const index = this.keys.indexOf(key);
    if (index > -1) this.keys.splice(index, 1);
  }

  public async acquire<T>(key: string, callback: () => Promise<T>): Promise<T> {
    try {
      await this.add(key);
      const result = await callback();
      this.remove(key);
      return result;
    } catch (error) {
      this.remove(key);
      throw error;
    }
  }

  public isLoading(key?: string): boolean {
    if (typeof key !== 'string') return this.keys.length > 0;
    return !!this.keys.find((loading) => loading === key);
  }
}
