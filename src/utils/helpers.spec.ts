import { getMeta } from './helpers';

test('should create the meta info for the response', () => {
  expect(getMeta(671, '5', 50, 'http://localhost:2000', 'hamburgers')).toEqual({
    count: 671,
    next: 'http://localhost:2000/hamburgers?page=6',
    pages: 14,
    prev: 'http://localhost:2000/hamburgers?page=4',
  });
});
