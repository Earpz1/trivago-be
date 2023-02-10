import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'
import usersModel from '../users/model.js'
import atob from 'atob'

export const createAccessToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1 week' },
      (error, token) => {
        if (error) reject(error)
        else resolve(token)
      },
    ),
  )

export const verifyAccessToken = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET, (error, originalPayload) => {
      if (error) reject(error)
      else resolve(originalPayload)
    }),
  )

export const JWTMiddleware = async (request, response, next) => {
  if (!request.headers.authorization) {
    next(createHttpError(401, 'Please enter your login Details'))
  } else {
    try {
      const accessToken = request.headers.authorization.replace('Bearer ', '')
      const payload = await verifyAccessToken(accessToken)

      request.user = {
        _id: payload._id,
        role: payload.role,
      }
      next()
    } catch (error) {
      console.log(error)
      next(createHttpError(401, 'Token not valid'))
    }
  }
}

export const hostOnlyMiddleware = async (request, response, next) => {
  if (request.user.role === 'host') {
    next()
  } else {
    next(createHttpError(403, 'You must be a host to complete this request'))
  }
}
