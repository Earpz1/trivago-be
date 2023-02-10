import express from 'express'
import createHttpError from 'http-errors'
import {
  createAccessToken,
  JWTMiddleware,
  hostOnlyMiddleware,
} from '../lib/tools.js'
import usersModel from './model.js'
import accommodationModel from '../accommodation/model.js'

const usersRouter = express.Router()

//Allows a user to register a new account and returns a JWT token

usersRouter.post('/register', async (request, response, next) => {
  try {
    const newUser = new usersModel(request.body)
    const { _id, role } = await newUser.save()

    const payload = { _id: _id, role: role }
    const accessToken = await createAccessToken(payload)

    response.status(200).send({ accessToken })
  } catch (error) {
    next(error)
  }
})

//Allows a user to login and returns a JWT token

usersRouter.post('/login', async (request, response, next) => {
  try {
    const { email, password } = request.body
    const user = await usersModel.checkDetails(email, password)

    if (user) {
      const payload = { _id: user._id, role: user.role }
      const accessToken = await createAccessToken(payload)
      response.send({ accessToken })
    } else {
      next(createHttpError(401, 'Your login details were not correct'))
    }
  } catch (error) {
    next(error)
  }
})

//Allow a user to get details about them, not including password!
usersRouter.get('/me', JWTMiddleware, async (request, response, next) => {
  try {
    const user = await usersModel
      .findById(request.user._id)
      .select({ password: 0 })

    if (user) {
      response.send(user)
    } else {
      next(
        createHttpError(404, `Unable to find user with ID ${request.user._id}`),
      )
    }
  } catch (error) {
    next(error)
  }
})

//Allow a user to get all the accommodations they are hosting

usersRouter.get(
  '/me/accommodations',
  JWTMiddleware,
  hostOnlyMiddleware,
  async (request, response, next) => {
    const accommodations = await accommodationModel.find({
      host: request.user._id,
    })

    if (accommodations) {
      response.send(accommodations)
    } else {
      next(createHttpError(404, `You don't currently have any accommodations`))
    }
  },
)

export default usersRouter
