import amqplib from 'amqplib'

// const log = console.log
// console.log = function (...args) {
//   log.apply(console, [new Date()].concat(...args))
// }

const runProducerDLX = async () => {
  try {
    // B1: connect + create channel
    const connection = await amqplib.connect('amqp://guest:12345@localhost')
    const channel = await connection.createChannel()

    // B2: khai báo exchange, queue, routing key
    const notificationExchange = 'notificationEx' // direct exchange (thành công)
    const notiQueue = 'notificationQueueProcess' // assert queue
    const notificationExchangeDLX = 'notificationExDLX' // thất bại
    const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX' // routing key

    // B3: create exchange chính
    await channel.assertExchange(notificationExchange, 'direct', { durable: true })

    // B4: Tạo queue chính kèm cấu hình DLX
    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive: false, // cho phép các kết nối khác truy vập vào cùng 1 lúc queue
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX
    })

    // B5: bind queue vào exchange
    await channel.bindQueue(queueResult.queue, notificationExchange, '')

    // B6: send message
    const msg = 'a new product'
    console.log('Message sent:', msg)
    channel.sendToQueue(queueResult.queue, Buffer.from(msg), { expiration: '10000' })

    setTimeout(() => {
      connection.close()
      process.exit(0)
    }, 500)
  } catch (error) {
    console.error(error)
  }
}

runProducerDLX()
  .then((rs) => console.log(rs))
  .catch(console.error)
