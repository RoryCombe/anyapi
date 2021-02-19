export default {
  getCollections: jest
    .fn()
    .mockImplementation(() =>
      Promise.resolve(['SomeCollection', 'AnyCollection'])
    ),
  getAll: jest.fn().mockImplementation(() =>
    Promise.resolve({
      meta: {
        count: 671,
        next: 'http://localhost:2000/SomeCollection?page=6',
        pages: 14,
        prev: 'http://localhost:2000/SomeCollection?page=4',
      },
      results: [],
    })
  ),
  get: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
};
