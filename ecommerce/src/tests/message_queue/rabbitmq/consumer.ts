import amqplib from 'amqplib'

const runConsumer = async () => {
  try {
    const connection = await amqplib.connect('amqp://guest:12345@localhost')
    const channel = await connection.createChannel()
    const queueName = 'test-topic'
    await channel.assertQueue(queueName, {
      durable: true
    })

    channel.consume(
      queueName,
      (message) => {
        console.log('Received:', message?.content.toString())
      },
      {
        // xoá tin nhắn ngay sau khi queue gửi đi
        noAck: false
      }
    )
  } catch (error) {
    console.error(error)
  }
}

runConsumer().catch(console.error)
