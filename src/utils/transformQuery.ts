import { type ParsedQs } from 'qs'

const baseTransformQuery = (query: ParsedQs) => {
  const { limit, page } = query

  return {
    limit: limit ? parseInt(limit as string, 10) : 50,
    page: page ? parseInt(page as string, 10) : 1
  }
}

const transformQuery = (query: ParsedQs, filterQuery: Record<string, unknown>, selectQuery: string[]) => {
  // query đọc về là kiểu string nhưng có một số ta cần phải convert về number,... để đáp ứng service
  const { sort, filter, select } = query
  const limitPage = baseTransformQuery(query)

  // chỉ định ép kiểu string sang number dạng thập phân
  const parsedSort = sort ? (sort as string) : 'ctime'
  const parsedFilter = filter ? JSON.parse(filter as string) : filterQuery
  const parsedSelect = select ? (select as string).split(',') : selectQuery

  return {
    ...limitPage,
    sort: parsedSort,
    filter: parsedFilter,
    select: parsedSelect
  }
}

const transformQueryAllDiscounts = (query: ParsedQs) => {
  // query đọc về là kiểu string nhưng có một số ta cần phải convert về number,... để đáp ứng service
  const limitPage = baseTransformQuery(query)
  const { codeId, shopId } = query

  return {
    ...limitPage,
    codeId: codeId as string,
    shopId: shopId as string
  }
}

export { transformQuery, transformQueryAllDiscounts }
