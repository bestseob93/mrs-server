import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Doctor = new Schema({
	job: { type: String, required: true },
	doctorName: { type: String, required: true },
	doctorFace: String,
	doctorPersonId: String,
	birth: { type: String, required: true },
	department: { type: String, required: true },
	doctorBarcode: String
});


export default mongoose.model('doctor', Doctor);
