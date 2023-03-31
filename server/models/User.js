const {Schema, model} = require('mongoose')
const validator = require('validator');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config ();

userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, `Provide a valid e-mail`]
    },
    role: {
        type: String,
        enum: ['user', 'manager', 'admin'],
        default: 'user'
    },
    hashedPassword: {
        type: String,
        minlength: 8,
        select: false
    },
    birthday: {
        type: Date
    },
});

// userSchema.pre('save', async function (next) {
//     try {
//         this['userID'] = uniqId('id-u_');

//         this['password'] = await bcrypt.hash(this['password'], 10);

//         return next();
//     } catch (e) {
//         return next(e);
//     }
// });

userSchema.virtual('password')

    .set(function(password){
        this.hashedPassword = this.encryptPassword(password);
    })

    .get(function(){
        return 'Top secret!'
    });


schema.methods = {

    encryptPassword: function (password) {

        return bcrypt.hash(password, 10);
    },
    checkPassword: function (password) {
        return bcrypt.compare(password, this.hashedPassword);
    }
};

schema.statics = {

    authorize: function(password, callback){

        let User = this;

        async.waterfall([
            // function(callback){
            //     if (username){
            //         User.findOne({username: username}, callback);
            //     }
            // },
            function(user, callback){
                if (user){
                    if (user.checkPassword(password)){
                        callback(null, user);
                    } else {
                        callback(403);
                    }
                } else {
                    callback(403);
                }
            }
        ], callback);
    },
    createUser: function(username, password, email, birthday, callback){

        let User = this;

        let nameFilter = /^([a-zA-Z0-9_\-])+$/;
        let passFilter = /^[a-zA-Z0-9,!,%,&,@,#,$,\^,*,?,_,~,+]*$/;

        async.waterfall([
            function(callback){
                if (!nameFilter.test(username)) {
                    callback('userError');
                } else {
                    callback(null);
                }
            },
            function(callback){
                if ((!passFilter.test(password)) || (password.length < 4)) {
                    callback('passwordError');
                } else {
                    callback(null);
                }
            },
            function(callback){
                User.findOne({username:username}, function(err, user){
                    if (user) {
                        callback('doubleUser');
                    } else {
                        callback(null);
                    }
                });
            }
        ],
        function(err){

            if (err){
                callback(err);
            } else {

                let user = new User({
                    username,
                    password,
                    email,
                    birthday
                });

                user.save(function(err){
                    if (err) return callback(err);
                    callback (null, admin);
                });
            }
        });
    }
};

module.exports = model('User', userSchema)
