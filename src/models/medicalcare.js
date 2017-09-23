import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Medicalcare = new Schema({
	medicalType: String,
	drug: {
		drugName: String,
		drugImageUrl: String,
		drugCompany: String,
		drugCompanyInfo: String,
		insuranceCode: String,
		drugShape: String,
		drugIngrident: String,
		drugSave: String,
		drugEffect: String,
		drugAmount: String,
		drugCaution: String,
		drugBarcode: String
	},
	inject: {
		injectName: String,
		injectAmount: String,
		injectBarcode: String
	},
	medicalInfo: String,
	date: {
		edited: { type: Date, default: Date.now }
	}
});

export default mongoose.model('medicalcare', Medicalcare);
// 약 정보

// drugName : String
// drugBacord : String
// drugImageUrl : String


