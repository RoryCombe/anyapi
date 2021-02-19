import { getMeta } from './helpers';

describe('meta info for a response', () => {
  test('should handle zero count in a collection', () => {
    expect(getMeta(0, '', 50, 'http://localhost:2000', 'hamburgers')).toEqual({
      count: 0,
      pages: 0,
      next: null,
      prev: null,
    });
  });

  test('should handle single page results in a collection', () => {
    expect(getMeta(50, '', 50, 'http://localhost:2000', 'hamburgers')).toEqual({
      count: 50,
      pages: 1,
      next: null,
      prev: null,
    });
  });

  test('should handle pagination in a collection', () => {
    expect(getMeta(234, '', 25, 'http://localhost:2000', 'hamburgers')).toEqual(
      {
        count: 234,
        pages: 10,
        next: 'http://localhost:2000/hamburgers?page=2',
        prev: null,
      }
    );

    expect(
      getMeta(234, '1', 25, 'http://localhost:2000', 'hamburgers')
    ).toEqual({
      count: 234,
      pages: 10,
      next: 'http://localhost:2000/hamburgers?page=2',
      prev: null,
    });

    expect(
      getMeta(671, '5', 50, 'http://localhost:2000', 'hamburgers')
    ).toEqual({
      count: 671,
      pages: 14,
      next: 'http://localhost:2000/hamburgers?page=6',
      prev: 'http://localhost:2000/hamburgers?page=4',
    });
  });
});
