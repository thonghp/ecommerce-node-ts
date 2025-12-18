import amqp from 'amqplib'

async function consumerOrderedMessage() {
  const connection = await amqp.connect('amqp://guest:12345@localhost')
  const channel = await connection.createChannel()
  const queueName = 'ordered-queued-message'
  await channel.assertQueue(queueName, { durable: true })

  // xử dụng prefetch để giữ nguyên thứ tự message
  channel.prefetch(1)

  channel.consume(queueName, (msg) => {
    const message = msg!.content.toString()
    // mô phỏng thời giản nhận message có cái nhận trước cái nhận sau do mạng
    setTimeout(() => {
      console.log(`processed message::${message}`)
      channel.ack(msg!)
    }, Math.random() * 1000)
  })
}

consumerOrderedMessage().catch((error) => {
  console.error('Error:', error)
})
