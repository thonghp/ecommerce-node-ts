// ['a', 'b', 'c'] => { a: 1, b: 1, c: 1 }
const getSelectData = (select: string[]) => {
  return Object.fromEntries(select.map((item) => [item, 1]))
}

const unGetSelectData = (select: string[]) => {
  return Object.fromEntries(select.map((item) => [item, 0]))
}

// lấy ra các instance của object đó
const getInstanceChain = (obj: unknown) => {
  const chain: string[] = []
  let proto = Object.getPrototypeOf(obj)
  while (proto) {
    // Lấy constructor nếu có
    if (proto.constructor && proto.constructor.name) {
      chain.push(proto.constructor.name)
    }

    proto = Object.getPrototypeOf(proto)
  }

  return chain
}

// cách này thì side effect vì nó thay đổi object gốc, cách ở dưới thì clone ra hợp lý hơn
const removeNullAndUndefinedObject = <T extends object>(obj: T): Partial<T> => {
  Object.keys(obj).forEach((key) => {
    const value = obj[key as keyof T]
    if (value == null) {
      delete obj[key as keyof T]
    }
  })

  return obj
}

// Loại bỏ null và undefined, trong lập trình người ta thường gọi là nil (dùng nhiều trong lodash)
const omitNil = <T extends object>(obj: T): Partial<T> => {
  const cleaned: Partial<T> = {}
  Object.keys(obj).forEach((key) => {
    const value = obj[key as keyof T]
    if (value != null) {
      cleaned[key as keyof T] = value
    }
  })

  return cleaned
}

const convertObjectToFlatten = <T extends object>(obj: T): Record<string, unknown> => {
  // console.log('[1]: ', obj)
  const flattened: Record<string, unknown> = {}
  Object.keys(obj).forEach((key) => {
    const value = obj[key as keyof T]
    if (typeof value === 'object' && !Array.isArray(value)) {
      const childFlat = convertObjectToFlatten(value as object)
      Object.keys(childFlat).forEach((nestedKey) => {
        flattened[`${key}.${nestedKey}`] = childFlat[nestedKey]
      })
    } else {
      flattened[key] = value
    }
  })

  // console.log('[2]: ', final)
  return flattened
}

// ignore null and undefined field in object and convert nested object to flat
const sanitizeAndFlatten = <T extends object>(obj: T): Record<string, unknown> => {
  const cleaned = omitNil(obj)
  const flatObj = convertObjectToFlatten(cleaned)

  return flatObj
}

export {
  removeNullAndUndefinedObject,
  convertObjectToFlatten,
  getSelectData,
  omitNil,
  sanitizeAndFlatten,
  unGetSelectData,
  getInstanceChain
}
