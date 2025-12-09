import { consumerToQueue } from '~/services/consumerQueue.service'

const queueName = 'test-topic'

consumerToQueue(queueName)
  .then(() => {
    console.log(`Message consumer started ${queueName}`)
  })
  .catch((error) => {
    console.error(`message error: ${error.message}`)
  })

// consumerToQueueNormal(queueName)
//   .then(() => {
//     console.log(`Message consumerToQueueNormal started`)
//   })
//   .catch((error) => {
//     console.error(`message error: ${error.message}`)
//   })

// consumerToQueueFailed(queueName)
//   .then(() => {
//     console.log(`Message consumerToQueueFailed started`)
//   })
//   .catch((error) => {
//     console.error(`message error: ${error.message}`)
//   })
