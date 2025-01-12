import mongoose from 'mongoose'
import os from 'os'
import process from 'process'

const _SECONDS = 5000

const countConnect = (): void => {
  const connections = mongoose.connections.length
  console.log(`Number of connections: ${connections}`)
}

/**
 * Monitors and logs the number of active database connections, CPU cores, and memory usage every 5 seconds.
 * If the number of connections exceeds the calculated maximum based on CPU cores, it logs a warning message.
 * Note: Assumes each CPU core can handle up to 5 connections.
 */

const checkOverload = (): void => {
  setInterval(() => {
    const numConnection = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss

    // Giả sử mỗi core của máy chịu được 5 connection, lưu ý không nên đặt chịu tải tối đa gần bằng máy
    const maxConnections = numCores * 5

    console.log(`Activate connections: ${numConnection}`)
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`)

    if (numConnection > maxConnections) {
      console.log(`Connections overload detected`)
      // notify.send(...)
    }
  }, _SECONDS) // monitor every 5 seconds
}

export { countConnect, checkOverload }
