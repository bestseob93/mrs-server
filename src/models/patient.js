import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const bloodTypes = ['A', 'B', 'AB', 'O'];

const Patient = new Schema({
	patientName: { type: String, required: true },
	gender: { type: String, required: true },
	patientTel: { type: String, required: true },
	birth: { type: String, required: true },
	address : { type: String, required: true },
	bloodType: { type: String, enum: bloodTypes },
	chargeDoctor: { type: Schema.Types.ObjectId, ref: 'doctor'},
	bed: { type: Schema.Types.ObjectId, ref: 'bed'},
	disease: String,
	date: {
		Admission: { type: Date, default: Date.now }
	},
	patientBarcode: String,
	recordFiles: [
		{
			recordedTime: { type: Date, default: Date.now },
			doctorName: { type: String },
			fileName: { type: String }
		}
	],
	care: [{ type: Schema.Types.ObjectId, ref: 'medicalcare'}]
});

export default mongoose.model('patient', Patient);
// 환자 정보
// name : String
// birth : String
// address : String
// bloodType : String
// chargeDoctor : String
// bed : String
// room : String
// disease : String
// Date : Date
// barcordID : String
// recordFile : [String]
// Drug : String
