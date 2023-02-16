import express from 'express'
import { hostOnlyMiddleware, JWTMiddleware } from '../lib/tools.js'
import createHttpError from 'http-errors'
import bookingsModel from './model.js'

const bookingsRouter = express.Router()

//Post a new booking

bookingsRouter.post('/', async (request, response, next) => {
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

//Get a booking with a specific ID
bookingsRouter.get('/:id', JWTMiddleware, async (request, response, next) => {
  try {
    const booking = await bookingsModel
      .findById(request.params.id)
      .populate({ path: 'accommodationID', select: 'name city image' })
    response.status(200).send(booking)
  } catch (error) {
    next(error)
  }
})

//Update a booking with the details of the guest that has booked it along with the booking being set to 'Confirmed'
bookingsRouter.put('/:id', JWTMiddleware, async (request, response, next) => {
  try {
    const findBooking = await bookingsModel.findById(request.params.id)

    if (findBooking) {
      const editBooking = await bookingsModel.findByIdAndUpdate(
        request.params.id,
        request.body,
        { new: true },
      )
      response.status(200).send(editBooking)
    }
  } catch (error) {
    next(error)
  }
})

export default bookingsRouter
