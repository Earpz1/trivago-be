import mongoose from 'mongoose'

export const unauthorizedError = (error, request, response, next) => {
  if (error.status === 401) {
    response.status(401).send(error.message)
  } else {
    next(error)
  }
}

export const badRequestError = (error, request, response, next) => {
  if (error.status === 400 || error instanceof mongoose.Error.ValidationError) {
    response.status(400).send(error.message)
  } else {
    next(error)
  }
}

export const notFoundError = (error, request, response, next) => {
  if (error.status === 404) {
    response.status(404).send(error.message)
  } else {
    next(error)
  }
}

export const forbiddenError = (error, request, response, next) => {
  if (error.status === 403) {
    response.status(403).send(error.message)
  } else {
    next(error)
  }
}

export const genericError = (error, request, response, next) => {
  console.log(error)
  response.status(500).send(error.message)
}
