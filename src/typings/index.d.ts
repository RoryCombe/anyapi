export interface Adapter {
  getAll: (collection: string, options: any) => Promise<Array<any>>;
  get: (collection: string, id: string) => Promise<any>;
  create: (collection: string, data: any) => Promise<any>;
  update: (collection: string, id: string, data: any) => Promise<any>;
  destroy: (collection: string, id: string) => Promise<any>;
}
