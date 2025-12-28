import mysql, { ResultSetHeader } from 'mysql2'

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'ecommerce'
})
// 1 lần chèn bao nhiêu row
const batchSize = 100000
// tổng số row
const totalSize = 10_000_000
let currentId = 1
console.time(':::Processing Time:::')
const insertBatch = async () => {
  const values = []
  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `name-${currentId}`
    const age = currentId
    const address = `address-${currentId}`
    values.push([currentId, name, age, address])
    currentId++
  }

  // điều kiện dừng
  if (!values.length) {
    console.timeEnd(':::Processing Time:::')
    pool.end((err) => {
      if (err) {
        console.error('Error occurred while running batch')
      } else {
        console.log('Connection pool closed successfully')
      }
    })

    return
  }

  const sql = 'INSERT INTO test_table (id, name, age, address) VALUES ?'
  pool.query(sql, [values], function (err, results) {
    if (err) {
      throw err
    }

    const resultHeader = results as ResultSetHeader
    console.log(`Inserted ${resultHeader.affectedRows} records`)
    insertBatch()
  })
}

insertBatch().catch(console.error)
