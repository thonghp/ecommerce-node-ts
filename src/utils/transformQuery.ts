import { type ParsedQs } from 'qs'
const transformQueryProducts = (query: ParsedQs) => {
  // query đọc về là kiểu string nhưng có một số ta cần phải convert về number,... để đáp ứng service
  const { limit, sort, page, filter, select } = query

  // chỉ định ép kiểu string sang number dạng thập phân
  const parsedLimit = limit ? parseInt(limit as string, 10) : 50
  const parsedPage = page ? parseInt(page as string, 10) : 1
  const parsedSort = sort ? (sort as string) : 'ctime'
  const parsedFilter = filter ? JSON.parse(filter as string) : { isPublished: true }
  const parsedSelect = select ? (select as string).split(',') : ['product_name', 'product_price', 'product_thumb']

  return {
    limit: parsedLimit,
    sort: parsedSort,
    page: parsedPage,
    filter: parsedFilter,
    select: parsedSelect
  }
}

export { transformQueryProducts }
