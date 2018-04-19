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
        return res.send(result)
    },
    
    getUser: async(req, res) => {
        var user = User.find({_id: req.params.userId}).exec()
        console.log(user)
        return res.send(user)
    },
    
    newEvent: async(req, res)=> {
        var newEvent = new Event({
            title: req.body.title,
            eventCreator: req.body.creator,
        //  eventNonce: nonce,
            eventCreated: Date.now(),
            attendees: [],
            admins: [],
            tokenAmount: req.body.tokenAmount
          })
          
          await newEvent.save((err) => {
              if(err) console.log(err)
          })
          
          return res.send(newEvent)
    },
    
    listEvents: async(req, res) => {
        var events = await Event.find({}).sort({eventCreated: -1}).exec()  
        return res.send(events)
    },
    
    getEvent: async(req, res) => {
        var events = await Event.find({_id: req.params.eventId}).exec()  
        return res.send(events[0])
    },
    
    signAttendee: async(req, res) => {
        // get the msg and the sender
        const msg = req.body.msg
        const signedMsg = req.body.signedData
        
        // find the right attendee
        var attendee = await Attendee.find({ethAddress: msg}).exec()
        
        // add the signature
        var signatures = attendee.signatures
        signatures.push(signedMsg)
        
        // update the attendee
        await Attendee.update({ethAddress: msg}, {signatures: signatures})
        var updatedAttendee = await Attendee.find({ethAddress: msg}).exec()

        return res.send({attendee: updatedAttendee, message: "Attendee has been successfully updated."})
    },
    
    addAttendee: async(req, res) => {
         const eventId = req.params.eventId
          
          // then create a new attendee listing
          var newAttendee = new Attendee({
            ethAddress: req.body.attendeeEthAddress,
            admins: [req.body.adminAdress],
            signatures: [req.body.adminSignature],
            eventId: eventId,
            userId: null                  // add if user is registered
          })
          
          // add the attendee to the event  
          var event = await Event.find({_id: eventId}).exec()
          event = event[0]
          console.log("event",event)
          event.attendees.push(newAttendee)
          var result = await Event.update({_id: eventId}, event)
          
          console.log(result, event)
          
          return res.send({updatedEvent: event})
        
          // first add the event to the appropriate users event list
          // var user
          // var users = User.find({ethAddress: req.body.attendeeEthAddress})
          // users.exec((err, result) => {
          //   if(err) console.log(err)
            
          //   user = result[0]
          //   if(result.length !== 0){
          //     if(typeof user.events == "undefined"){
          //       user.events = [req.params.eventId]
          //     } else {
          //       user.events.push(req.params.eventId)
          //     }
          //     users.update({ethAddress: req.body.attendeeEthAddress}, user).exec()
          //   }

          //   var userId = user ? user._id : 0
            
          // })
    },
    
    getUnsignedAttendees: async(req, res) => {
          var unsignedattendeesToReturn = []
          var signedAttendeesToReturn = []
          
          var requiredSignatures = req.params.requiredSignatures || 5
          var signer             = req.params.signer
          
          var events = await Event.find({_id: req.params.eventId}).exec()
          var event = events[0]
          
          console.log(events)
          event.attendees.forEach((attendee, index) => {
            if(typeof attendee.signatures == "undefined") return  // I added this field to the Schema later, so some attendees don't have a signatures field, this passes over those          
            if(attendee.admins.indexOf(signer) > -1){        // if admin has already signed this one
              signedAttendeesToReturn.push(attendee)
            } else {
              unsignedattendeesToReturn.push(attendee)
            }
          })
          
          return res.send({unsigned: unsignedattendeesToReturn,
                           signed: signedAttendeesToReturn})         
    }
    
}