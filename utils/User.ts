import mongoose from 'mongoose';
import info from '../globalInfo.ts'

const schema = new mongoose.Schema({
    key: {type: Number, default: info.defaultKey},
    balance: {type: Number, default: 0}
})

export default mongoose.model('User', schema)