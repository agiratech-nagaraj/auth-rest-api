const bcrypt = require("bcrypt");
const randToken = require('rand-token');

class SecurityService {
    static hashPassword(data){
        return new Promise((res, rej)=>{
            bcrypt.hash(data, 10, (err, hash)=>{
                if (err){
                    rej(err);
                    return
                }
                res(hash);
            })
        });
    }

    static comparePasswordHash(passwordStr, hashPasswordStr){
        return new Promise((res, rej)=>{
            bcrypt.compare(passwordStr, hashPasswordStr, (err, res) => {
                res(!!res)
            });
        });
    }

    static generateOTP(){
        return randToken.generate(6);
    }
}

module.exports = SecurityService
