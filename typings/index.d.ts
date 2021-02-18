export interface Adapter {
  getCollections: () => Promise<Array<string>>;
  getAll: (
    collection: string,
    options: any
  ) => Promise<{
    meta: {
      count: number;
      pages: number;
      next: string | null;
      prev: string | null;
    };
    results: Array<any>;
  }>;
  get: (collection: string, id: string) => Promise<any>;
  create: (collection: string, data: any) => Promise<any>;
  update: (collection: string, id: string, data: any) => Promise<any>;
  destroy: (collection: string, id: string) => Promise<any>;
}
