import amqplib from 'amqplib'

const message = 'hello rabbitmq'
const runProducer = async () => {
  try {
    // connect đến RabbitMQ localhost có username là guest và password là 12345
    const connection = await amqplib.connect('amqp://guest:12345@localhost')
    const channel = await connection.createChannel()
    const queueName = 'test-topic'

    // check tồn tại queue name và đưa queue lên disk
    await channel.assertQueue(queueName, {
      durable: true
    })

    // gửi message vô hàng đợi
    channel.sendToQueue(queueName, Buffer.from(message))
    console.log('Message sent:', message)
    setTimeout(() => {
      connection.close()
      process.exit(0)
    }, 500)
  } catch (error) {
    console.error(error)
  }
}

runProducer()
  .then((rs) => console.log(rs))
  .catch(console.error)
