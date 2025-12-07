import amqp, { type Channel } from 'amqplib'

const connectionToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:12345@localhost')
    if (!connection) {
      throw new Error('Connection not established')
    }

    const channel = await connection.createChannel()

    return { channel, connection }
  } catch (error) {
    console.error('Error connecting to rabbitmq', error)
    throw error
  }
}

const connectionToRabbitMQForTest = async () => {
  try {
    const { channel, connection } = await connectionToRabbitMQ()

    const queueName = 'test-queue'
    const message = 'hello everyone'
    await channel.assertQueue(queueName)
    await channel.sendToQueue(queueName, Buffer.from(message))

    await connection.close()
  } catch (error) {
    console.error('Test connection to RabbitMQ failed', error)
  }
}

const consumerQueue = async (channel: Channel, queueName: string) => {
  try {
    await channel.assertQueue(queueName, { durable: true })
    console.log('waiting for messages ...')
    channel.consume(
      queueName,
      (message) => {
        console.log(`Received message ${queueName}::`, message?.content.toString())
        /*
          1. find user following shop
          2. send message to user
          3. yes ==> success
          4. error ==> setup DLX
        */
      },
      {
        noAck: true
      }
    )
  } catch (error) {
    console.error('error publish message to rabbitMQ', error)
    throw error
  }
}

export { connectionToRabbitMQ, connectionToRabbitMQForTest, consumerQueue }
