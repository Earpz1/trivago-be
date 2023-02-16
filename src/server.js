import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import usersRouter from '../api/users/index.js'
import accommodationRouter from '../api/accommodation/index.js'
import {
  badRequestError,
  forbiddenError,
  genericError,
  notFoundError,
  unauthorizedError,
} from './errorHandlers.js'
import bookingsRouter from '../api/bookings/index.js'

const server = express()
const port = process.env.PORT || 3001

//Middleware
server.use(cors())
server.use(express.json())

//Endpoints
server.use('/users', usersRouter)
server.use('/accommodation', accommodationRouter)
server.use('/bookings', bookingsRouter)

//Error handlers
server.use(unauthorizedError)
server.use(notFoundError)
server.use(forbiddenError)
server.use(badRequestError)
server.use(genericError)

mongoose.connect(process.env.MONGO_DB_URL)

mongoose.connection.on('connected', () => {
  server.listen(port, () => {
    console.log(`Database and server connected on port ${port}`)
  })
})
