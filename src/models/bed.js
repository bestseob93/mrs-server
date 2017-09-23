import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Bed = new Schema({
  beduuid: { type: String, required: true },
  isChecked: { type: Boolean }
});

export default mongoose.model('bed', Bed);
