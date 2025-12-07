import { connectionToRabbitMQForTest } from '../dbs/init.rabbit'

describe('Test rabbitmq connect', () => {
  it('should connect to successful RabbitMQ', async () => {
    const result = await connectionToRabbitMQForTest()
    expect(result).toBeUndefined()
  })
})
