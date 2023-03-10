import mongoose from 'mongoose'

const { Schema, model } = mongoose

const bookingSchema = new Schema({
  guestID: {
    type: Schema.Types.ObjectId,
    ref: 'usersModel',
    default: null,
  },
  hostID: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'usersModel',
  },
  accommodationID: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'accommodationModel',
  },
  dateFrom: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  confirmed: { type: Boolean, default: false },
})

export default model('bookingsModel', bookingSchema)
