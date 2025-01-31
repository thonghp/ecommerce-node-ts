import { ParsedQs } from 'qs'
const transformQueryProducts = (query: ParsedQs) => {
  const { limit, sort, page, filter, select } = query

  const parsedLimit = limit ? parseInt(limit as string, 10) : 50
  const parsedSort = sort ? (sort as string) : 'ctime'
  const parsedPage = page ? parseInt(page as string, 10) : 1
  const parsedFilter = filter ? JSON.parse(filter as string) : { isPublished: true }
  const parsedSelect = select ? (select as string).split(',') : []
  return {
    limit: parsedLimit,
    sort: parsedSort,
    page: parsedPage,
    filter: parsedFilter,
    select: parsedSelect
  }
}

export { transformQueryProducts }
