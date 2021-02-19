import { format } from 'date-fns';

const getMetaLink = (
  count: number,
  page: string,
  pages: number,
  baseUrl: string,
  collection: string,
  isPrevious?: boolean
) => {
  if (count === 0 || pages === 1) return null;

  const pageInt = page === '' ? 1 : parseInt(page, 10);

  if (isNaN(pageInt)) return null;

  const pageStr = isPrevious ? pageInt - 1 : pageInt + 1;
  return pageStr < 1 ? null : `${baseUrl}/${collection}?page=${pageStr}`;
};

export const getMeta = (
  count: number,
  page: string,
  pageSize: number,
  baseUrl: string,
  collection: string
) => {
  const pages = Math.ceil(count / pageSize);
  return {
    count,
    pages,
    next: getMetaLink(count, page, pages, baseUrl, collection),
    prev: getMetaLink(count, page, pages, baseUrl, collection, true),
  };
};

export const getDateNow = () => format(new Date(), 'yyyy-MM-dd HH:mm:ss');
