let mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    _id: {type: mongoose.Types.ObjectId, auto: true},
    userId: String,
    token: String,
    type: String,
    isVerified:Boolean,
},{capped: false, timestamps: {createdAt: 'created_at'}, versionKey: false});

tokenSchema.query.byUserIdAndType = function ({userId, type}){
  return this.where({userId, type})
}

tokenSchema.statics.add = function ({userId, token, type}) {
  return new Promise(async  (resolve, reject)=>{
      try {
          const doc = await this.findOneAndUpdate({userId, type}, {userId, token, type, isVerified: false}, {
              new: true,
              upsert: true
          });
          resolve(doc);
      }catch (e) {
          reject({error: e})
      }
  })
}

tokenSchema.statics.verify = function ({userId, token, type}) {
  return new Promise(async (resolve, reject)=>{
      const doc = await this.findOne().byUserIdAndType({userId, type});
      if (!!doc && doc.token === token){
          resolve(true);
          await this.findOneAndDelete({userId,type});
      }else {
          resolve(false);
      }
  })
}
module.exports = mongoose.model('Tokens', tokenSchema, 'tokens');
