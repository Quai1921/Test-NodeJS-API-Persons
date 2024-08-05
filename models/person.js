const mongoose = require("mongoose")

const addressSchema = new mongoose.Schema({
    street: String,
    number: Number,
    city: String,
})

const personSchema = new mongoose.Schema({
    identification: { type: String, required: true, unique: true },
    name: String,
    lastName: String,
    age: Number,
    photo: String,
    addresses: [addressSchema],
})

module.exports = mongoose.model("Person", personSchema)
