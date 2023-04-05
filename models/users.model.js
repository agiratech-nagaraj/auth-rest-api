let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let usersSchema = new mongoose.Schema({
    _id: {type: mongoose.Types.ObjectId, auto: true},
    name: String,
    dob: Date,
    email: {type: String, unique: true},
    phonenumber: {type: String, unique: true},
    password: String,
    sex: String,
    userType: String,
    profileImgUrl: String,
    isAdmin: Boolean,
    isEmailVerified: {type: Boolean, default: false}
}, {capped: false, timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}, versionKey: false});

usersSchema.query.byEmail = function ({email}) {
    return this.where({email});
}

usersSchema.pre('save', function (next) {
    const user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

usersSchema.statics.register = function (user) {
    return new Promise((resolve, reject) => {
        this.find({email: user.email})
            .then((result) => {
                if (!result || result.length === 0) {
                    this.create(user, ((err, doc) => {
                        if (!err) {
                            resolve(doc);
                            return
                        }
                        reject({error: 'Something went wrong', isSuccess: false});
                    }));
                } else {
                    reject({error: 'Email is already exists', isSuccess: false})
                }
            }).catch((err) => reject(err))
        ;
    });
}

usersSchema.statics.authenticate = function (auth) {
    return new Promise((resolve, reject) => {
        this.findOne({email: auth.email})
            .exec((err, user) => {
                if (!!user) {
                    bcrypt.compare(auth.password, user.password, (err, res) => {
                        if (!!res) {
                            const output = JSON.parse(JSON.stringify(user));
                            delete output.password;
                            resolve(output)
                        } else {
                            reject({error: 'Password not matched'});
                        }
                    })
                } else reject({error: 'user not found'});
            });
    });
}

usersSchema.statics.updateEmailVerified = function ({email}) {
    return new Promise(async (resolve, reject) => {
        const doc = await this.findOneAndUpdate({email}, {
            isEmailVerified: true
        },{
            new: true
        });
        resolve(doc);
    });
}

usersSchema.statics.resetPassword = function ({email, password}) {
    return new Promise(async (resolve, reject)=>{
        const that = this;
        bcrypt.hash(password, 10, async function (err, hash) {
            if (err) {
                resolve(false);
            }
            const result = await that.findOneAndUpdate({email: email}, {
                password: hash
            }, {new: true});
            resolve(!!result);
        });
    })
}
module.exports = mongoose.model('Users', usersSchema, 'users');
