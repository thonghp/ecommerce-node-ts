// ['a', 'b', 'c'] => { a: 1, b: 1, c: 1 }
const getSelectData = (select: string[] = []) => {
  return Object.fromEntries(select.map((item) => [item, 1]))
}

const unGetSelectData = (select: string[] = []) => {
  return Object.fromEntries(select.map((item) => [item, 0]))
}

export { getSelectData, unGetSelectData }
