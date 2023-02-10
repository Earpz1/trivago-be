import mongoose from 'mongoose'

const { Schema, model } = mongoose

const accommodationSchema = new Schema({
  name: { type: String, required: true },
  host: { type: Schema.Types.ObjectId, required: true, ref: 'usersModel' },
  description: { type: String, required: true },
  city: { type: String, required: true },
  rating: { type: String },
  maxGuests: { type: String, required: true },
})

export default model('accommodationModel', accommodationSchema)
