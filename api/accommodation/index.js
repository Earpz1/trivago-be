import express from 'express'
import createHttpError from 'http-errors'
import accommodationModel from './model.js'
import { hostOnlyMiddleware, JWTMiddleware } from '../lib/tools.js'
import queryString from 'mongoose'

const accommodationRouter = express.Router()

//Will add a new accommodation and assign the hostID as the current logged in user
accommodationRouter.post(
  '/',
  JWTMiddleware,
  hostOnlyMiddleware,
  async (request, response, next) => {
    try {
      const newAccommodation = new accommodationModel({
        name: request.body.name,
        city: request.body.city,
        maxGuests: request.body.maxGuests,
        description: request.body.description,
        image: request.body.image,
        rating: request.body.rating,
        host: request.user._id,
      })
      const { _id } = await newAccommodation.save()
      response.status(200).send({ _id })
    } catch (error) {
      next(error)
    }
  },
)

//Returns all accommoodations

accommodationRouter.get('/', async (request, response, next) => {
  let query = {}
  if (request.query.featured) {
    query = { featured: request.query.featured }
  }

  if (request.query.location) {
    query = { city: request.query.location }
  }
  try {
    const accommodations = await accommodationModel
      .find(query)
      .populate({ path: 'host', select: 'email name' })
    response.status(200).send(accommodations)
  } catch (error) {
    next(error)
  }
})

//Return a specific accommodation, only if a user is logged in

accommodationRouter.get('/:id', async (request, response, next) => {
  try {
    const accommodation = await accommodationModel
      .findById(request.params.id)
      .populate({ path: 'host', select: 'name email' })

    if (accommodation) {
      response.send(accommodation)
    } else {
      next(
        createHttpError(
          404,
          `We could not find an accommodation with the ID ${request.params.id}`,
        ),
      )
    }
  } catch (error) {
    next(error)
  }
})

accommodationRouter.put(
  '/:id',
  JWTMiddleware,
  hostOnlyMiddleware,
  async (request, response, next) => {
    try {
      const findAccommodation = await accommodationModel.findById(
        request.params.id,
      )

      if (findAccommodation) {
        if (findAccommodation.host.toString() === request.user._id) {
          const editAccommodation = await accommodationModel.findByIdAndUpdate(
            request.params.id,
            request.body,
            { new: true },
          )

          response.status(204)
        } else {
          next(createHttpError(403, `This is not your accommodation to edit`))
        }
      } else {
        next(
          createHttpError(
            404,
            `The accommodation you are looking for does not exist`,
          ),
        )
      }
    } catch (error) {
      console.log(error)
      next(error)
    }
  },
)

//Delete an accommodation but only if the property exists, you role is host AND you are the owner
accommodationRouter.delete(
  '/:id',
  JWTMiddleware,
  hostOnlyMiddleware,
  async (request, response, next) => {
    try {
      const findAccommodation = await accommodationModel.findById(
        request.params.id,
      )

      if (findAccommodation) {
        if (findAccommodation.host.toString() === request.user._id) {
          const deletedAccommodation = await accommodationModel.findByIdAndDelete(
            request.params.id,
          )

          if (deletedAccommodation) {
            response.status(204).send()
          }
        } else {
          next(
            createHttpError(403, `This accommodation does not belong to you!`),
          )
        }
      } else {
        next(
          createHttpError(
            404,
            `The accommodation you were looking for does not exist`,
          ),
        )
      }
    } catch (error) {
      next(error)
    }
  },
)

export default accommodationRouter
