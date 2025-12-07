import mongoose from 'mongoose'

const connectString = 'mongodb://localhost:27017/nodejs1'
const TestSchema = new mongoose.Schema({ name: String })
const Test = mongoose.model('Test', TestSchema)

describe('Test mongodb connect', () => {
  let connection: typeof mongoose

  beforeAll(async () => {
    connection = await mongoose.connect(connectString)
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  it('should connect to successful MongoDB', () => {
    expect(mongoose.connection.readyState).toBe(1)
  })

  it('should create a new document', async () => {
    const user = new Test({ name: 'Demo' })
    await user.save()
    expect(user.isNew).toBe(false)
  })

  it('should find a document to the database', async () => {
    const user = await Test.findOne({ name: 'Demo' })
    expect(user).toBeDefined()
    expect(user?.name).toBe('Demo')
  })
})
