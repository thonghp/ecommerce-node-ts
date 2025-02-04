// ['a', 'b', 'c'] => { a: 1, b: 1, c: 1 }
const getSelectData = (select: string[] = []) => {
  return Object.fromEntries(select.map((item) => [item, 1]))
}

const unGetSelectData = (select: string[] = []) => {
  return Object.fromEntries(select.map((item) => [item, 0]))
}

const removeNullAndUndefinedObject = (obj: any) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) {
      delete obj[key]
    }
  })
  return obj
}

const updateNestedObjectParser = (obj: any) => {
  // console.log('[1]: ', obj)
  const final: any = {}
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      const response = updateNestedObjectParser(obj[key])
      Object.keys(response).forEach((k) => {
        final[`${key}.${k}`] = response[k]
      })
    } else {
      final[key] = obj[key]
    }
  })
  // console.log('[2]: ', final)
  return final
}

// ignore null and undefined field in object and convert nested object to flat
const cleanAndFlattenObject = (obj: any) => {
  const final: any = {}

  Object.keys(obj).forEach((key) => {
    const value = obj[key]

    // Bỏ qua các giá trị null hoặc undefined
    if (value == null) return

    if (typeof value === 'object' && !Array.isArray(value)) {
      const response = cleanAndFlattenObject(value)
      Object.keys(response).forEach((k) => {
        final[`${key}.${k}`] = response[k]
      })
    } else {
      final[key] = value
    }
  })

  return final
}

export { cleanAndFlattenObject, getSelectData, removeNullAndUndefinedObject, unGetSelectData, updateNestedObjectParser }
