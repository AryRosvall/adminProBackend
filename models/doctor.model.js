const { Schema, model } = require('mongoose');
const { collection } = require('./user.model');

const DoctorSchema = Schema({
  name: {
    type: String,
    required: true
  },
  img: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hospitals: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true
    }],
}, { collection: 'doctors' });

DoctorSchema.method('toJSON', function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model('Doctor', DoctorSchema);