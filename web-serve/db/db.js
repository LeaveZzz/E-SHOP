import mongoose from 'mongoose'
import config from '../src/config'

const password = config.password ? ':'+config.password + '@' : '';
const dbURL = `mongodb://${config.user}${password}${config.host}/${config.database}`;
mongoose.connect(dbURL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log(`${config.database}数据库连接成功!`))
	.catch(err => console.log(err, '数据库连接失败!'));
	
const adminSchema = new mongoose.Schema({
	adminName:String,
	password:String
})
export const Administrator = mongoose.model('Administrator',adminSchema)
// Administrator.create({
// 	adminName:'Leo',
// 	password:'980408'
// },(err,doc)=>{
// 	console.log(err,doc)
// })