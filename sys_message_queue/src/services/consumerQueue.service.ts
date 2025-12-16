import { connectionToRabbitMQ, consumerQueue } from '~/dbs/init.rabbit'

// const log = console.log
// console.log = function (...args: any[]) {
//   log.apply(console, [new Date()].concat(...args))
// }

const consumerToQueue = async (queueName: string) => {
  try {
    const { channel } = await connectionToRabbitMQ()
    await consumerQueue(channel, queueName)
  } catch (error) {
    console.error('Error consumerToQueue::', error)
  }
}

// channel.nack(msg, false, false)
const consumerToQueueNormal = async (queueName: string) => {
  try {
    const { channel, connection } = await connectionToRabbitMQ()
    const notiQueue = 'notificationQueueProcess'

    // test trường hợp hết hạn TTL
    // const timeExpired = 15000
    // setTimeout(() => {
    //   channel.consume(notiQueue, (msg) => {
    //     if (!msg) {
    //       return
    //     }
    //     console.log('Send notificationQueue successfully processed', msg.content.toString())
    //     channel.ack(msg)
    //   })
    // }, timeExpired)

    // test trường hợp lỗi logic code
    channel.consume(notiQueue, (msg) => {
      // if (!msg) {
      //   return
      // }

      try {
        const numberTest = Math.random()
        console.log('numberTest', numberTest)
        if (numberTest > 0.5) {
          throw new Error('Send notification failed:: hot fix')
        }

        console.log('Send notificationQueue successfully processed', msg!.content.toString())
        channel.ack(msg!)
      } catch (error) {
        /*
          - nack viết tắt của từ negative acknowledgment, nack(message, allUpTo, requeue)
          - khi bị lỗi nó sẽ ném vào queue lỗi của chúng ta
          - allUpto thể hiện là có nên sắp xếp lại tin nhắn này không, false nghĩa là message này sẽ không đưa vào hàng đợi ban đầu nữa mà đẩy vào queue lỗi, nếu true thì ngược lại
          - requeue: false ==> chỉ từ chối tin nhắn hiện tại này thôi
        */
        channel.nack(msg!, false, false)
      }
    })
  } catch (error) {
    console.error(error)
  }
}

const consumerToQueueFailed = async (queueName: string) => {
  try {
    const { channel, connection } = await connectionToRabbitMQ()
    const notificationExchangeDLX = 'notificationExDLX' // thất bại
    const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'
    const notiQueueHandler = 'notificationQueueHotFix'

    await channel.assertExchange(notificationExchangeDLX, 'direct', { durable: true })

    const queueResult = await channel.assertQueue(notiQueueHandler, {
      exclusive: false
    })

    await channel.bindQueue(queueResult.queue, notificationExchangeDLX, notificationRoutingKeyDLX)
    channel.consume(
      queueResult.queue,
      (msgFailed) => {
        if (!msgFailed) {
          return
        }

        console.log('this notification error: pls hot fix::', msgFailed.content.toString())
      },
      { noAck: true }
    )
  } catch (error) {
    console.error(error)
    throw error
  }
}

export { consumerToQueue, consumerToQueueNormal, consumerToQueueFailed }
