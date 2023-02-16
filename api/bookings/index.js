import express from 'express'
import { hostOnlyMiddleware, JWTMiddleware } from '../lib/tools.js'
import createHttpError from 'http-errors'
import bookingsModel from './model.js'

const bookingsRouter = express.Router()

//Post a new booking

bookingsRouter.post('/', JWTMiddleware, async (request, response, next) => {
  try {
    const newBooking = new bookingsModel(request.body)
    const { _id } = await newBooking.save()

    response.status(200).send({ _id })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

//Get all bookings

bookingsRouter.get('/', JWTMiddleware, async (request, response, next) => {
  try {
    const bookings = await bookingsModel.find({})
    response.status(200).send(bookings)
  } catch (error) {
    next(error)
  }
})

//Get all bookings with a specific host provided

bookingsRouter.get(
  '/myBookings',
  JWTMiddleware,
  hostOnlyMiddleware,
  async (request, response, next) => {
    try {
      const bookings = await bookingsModel.find({ hostID: request.user._id })
      response.status(200).send(bookings)
    } catch (error) {
      next(error)
    }
  },
)

export default bookingsRouter
