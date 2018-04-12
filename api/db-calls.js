var validate = require('../utils/validate')
var sigUtil = require('eth-sig-util')
var ethUtil = require('ethereumjs-util')

//Schemas
var User = require('../Schemas/userSchema.js')
var Event = require('../Schemas/eventSchema.js')
var Attendee = require('../Schemas/attendeeSchema.js')

module.exports = {
    
    init: function (req, res) {
        return res.json({ message: "API Initialized!"})
    },
    
    addUser: async function (req, res) {
        const emailAddress = req.body.emailAddress
        const ethAddress = req.body.ethAddress
    
        // check the signature to ensure that the owner of the address is making
        // the request
        const text = "This is a verification message for the server to validate your address."
        const msg = ethUtil.bufferToHex(new Buffer(text, 'utf8'))        
        const msgParams = {
            data: msg,
            sig: req.body.sig
        }
        const recovered = sigUtil.recoverPersonalSignature(msgParams)
        if(recovered !== ethAddress)
            return res.send("You are not authorized to edit this ETH address.")
        
        // check user input, return if invalid
        if(!validate.email(emailAddress)) {
          return res.send("invalid input")
        }
        
        // check if address has already been registered
        var user = await User.find({ethAddress: ethAddress}).exec()
        if(user.length > 0) {
            var result = await User.update({ethAddress: ethAddress}, {emailAddress: emailAddress})
            return res.send({msg: "User email has been updated.", result: result})
        }
        
        var newUser = new User({
            ethAddress: ethAddress,
            emailAddress: emailAddress
        })
      
        await newUser.save()
      
        return res.send({user: newUser})
    },
    
    getUsers: async(req, res) => {
        var result = await User.find({}).exec()
        res.send(result)
    }
    
}