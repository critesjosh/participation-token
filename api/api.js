var express = require('express')
var router = express.Router()
var validate = require('../utils/validate')
var db = require("./db-calls")

//Schemas
var User = require('../Schemas/userSchema.js')
var Event = require('../Schemas/eventSchema.js')
var Attendee = require('../Schemas/attendeeSchema.js')


module.exports = {
   init: function(app, mongoose){
        // To prevent errors from Cross Origin Resource Sharing, we will set 
        // our headers to allow CORS with middleware like so:
        app.use(function(req, res, next) {
         res.setHeader("Access-Control-Allow-Origin", "*")
         res.setHeader("Access-Control-Allow-Credentials", "true")
         res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE")
         res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        
         // and remove cacheing so we get the most recent comments
         res.setHeader("Cache-Control", "no-cache")
         next();
        });
        
        //now we can set the route path & initialize the API
        router.get("/", function(req, res) {
          return db.init(req, res)
        });
        
        router.post('/newuser', (req, res) => {
          return db.addUser(req, res)
        })
        
        router.get("/users", (req, res) => {
          return db.getUsers(req, res)
        })
        
        router.get('/user/:userId', (req, res) =>{
          var user = User.find({_id: req.params.userId})
          user.exec((err, result) => {
            if(err) console.log(err)
            res.send(result[0])
          })
        })
        
        // calling this enpoint creates a new event
        // probably better to make this a post request with the event title, creators ETH address
        // attendees will be added as they get signatures
        // admins are the admins authorized by the contract to sign attendee addresses
        router.post('/newevent', (req, res) => {
          
          var nonce = "12345"
          
          var newEvent = new Event({
            title: req.body.title,
            eventCreator: "creators eth address",
            eventNonce: nonce,
            eventCreated: Date.now(),
            attendees: ["an", "array", "of", "attendees"],
            admins: ["array", "of", "admins"],
            tokenAmount: 1000
          })
          
          newEvent.save((err)=>{if(err) { console.log(err)} })
          
          res.send(newEvent)
        })
        
        // get a list of all of the events
        router.get('/listevents', (req, res) => {
          var events = Event.find({})
          events.sort({eventCreated: -1}) // newest events first
          events.exec((err, result) => {
            if(err) console.log(err)
            res.send(result)
          })
        
        })
        
        // get details of the associated event ID
        router.get('/event/:eventId', (req, res) => {
          var events = Event.find({_id: req.params.eventId})
          events.exec((err, result) => {
            if(err) console.log(err)
            res.send(result[0])
          })
        })
        
        
        // get the list of attendees that still need signatues for the 
        // provided eventId
        
        // this API call should only be callable by contract admins,
        // no one else would have reason to need this info
        
        // takes an event id in the url
        // and the number of required signatures in the req body (req.body.requiredSignatures)
        
        router.get("/unsignedAttendees/:eventId/:requiredSignatures", (req, res) => {
          
          var unsignedattendeesToReturn = []
          var signedAttendeesToReturn = []
          
          var requiredSignatures = req.params.requiredSignatures
          var signer = req.params.signer
          
          var events = Event.find({_id: req.params.eventId})
          events.exec((err, result) => {
            if(err) console.log(err)
            var event = result[0]
            event.attendees.forEach((attendee, index) => {
              if(typeof attendee.signatures == "undefined") return // I added this field to the Schema later, so some attendees don't have a signatures field, this passes over those
              // to sign, they must not have signed && the attendee must need signatures
             //WIP, not complete 4/14
              if(attendee.admins.indexOf(signer) > -1 && attendee.signatures.length < requiredSignatures){
                signedAttendeesToReturn.push(attendee)
              } else {
                unsignedattendeesToReturn.push(attendee)
                attendee.admins.push(signer)
              }
              
            })
            res.send({unsigned: unsignedattendeesToReturn,
                      signed: signedAttendeesToReturn})
          })
          
        })
        
        // once the admin signs the attendees address, they call this endpoint
        // and add the signature to the attendees data
        
        // if the attendee does not need any more signatures, an email will be
        // sent containing a string of signatures and instructions on how they 
        // can claim their tokens
        
        router.post("/signAttendee/:eventId", (req, res) => {
            // get the msg and the sender
            const msg = req.body.msg
            const signedMsg = req.body.signedData
            
            
        })
        
        // add attendee to the specified eventId
        router.post("/addattendee/:eventId", (req, res) => {
          var event
          
          
          // first add the event to the appropriate users event list
          var user
          var users = User.find({ethAddress: req.body.attendeeEthAddress})
          users.exec((err, result) => {
            if(err) console.log(err)
            
            user = result[0]
            if(result.length !== 0){
              if(typeof user.events == "undefined"){
                user.events = [req.params.eventId]
              } else {
                user.events.push(req.params.eventId)
              }
              users.update({ethAddress: req.body.attendeeEthAddress}, user).exec()
            }

            var userId = user ? user._id : 0
            
            
            // then create a new attendee listing
            var newAttendee = new Attendee({
              ethAddress: req.body.attendeeEthAddress,
              admins: [req.body.adminAdress],
              signatures: [req.body.adminSignature],
              eventId: req.params.eventId,
              userId: userId
            })
            
            
            // add the attendee to the event  
            var events = Event.find({_id: req.params.eventId})
            events.exec((err, result) => {
              if(err) console.log(err)
              event = result[0]
              var attendees = event.attendees.push(newAttendee)
              events.update({_id: req.params.eventId}, event, (err, result) => {
                if(err) console.log(err)
                console.log(result)
                res.send("success")
              })
            })
          })

        })
        
        app.use("/api", router);
    }
}