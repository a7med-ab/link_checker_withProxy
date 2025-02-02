import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema({
  
  token: {
    type: String,
    required: true,
    unique: true
  }

});

const TokenModel = mongoose.model('DeviceToken', TokenSchema);
export default TokenModel;
