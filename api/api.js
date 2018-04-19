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
         res.setHeader("Access-Control-Allow-Origin", "*")  // set to aqui.joshcrites.com
         res.setHeader("Access-Control-Allow-Credentials", "true")
         res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE")
         res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        
         // and remove cacheing so we get the most recent comments
         res.setHeader("Cache-Control", "no-cache")
         next();
        });
        
        //now we can set the route path & initialize the API
        router.get("/", function(req, res) {
          db.init(req, res)
        });
        
        router.post('/newuser', (req, res) => {
          db.addUser(req, res)
        })
        
        router.get("/users", (req, res) => {
          db.getUsers(req, res)
        })
        
        router.get('/user/:userId', (req, res) => {
          db.getUser(req, res)
        })
        
        // calling this enpoint creates a new event
        // attendees will be added as they get signatures
        // admins are the admins authorized by the contract to sign attendee addresses
        router.post('/newevent', (req, res) => {
          db.newEvent(req, res)
        })
        
        // get a list of all of the events
        router.get('/listevents', (req, res) => {
          db.listEvents(req, res)
        })
        
        // get details of the associated event ID
        router.get('/event/:eventId', (req, res) => {
          db.getEvent(req, res)
        })
        
        router.post("/signall", (req, res) => {
          
        })
        
        
        
        // get the attendees that still need signatues for the eventId
        
        // this API call should only be callable by contract admins,
        // no one else would have reason to need this info
        // takes an event id in the url
        // and the number of required signatures in the req body (req.body.requiredSignatures)
        // returns an object {unsigned: [], signed: []}
        
        router.get("/unsignedAttendees/:eventId/:requiredSignatures", async(req, res) => {
          db.getUnsignedAttendees(req, res)
        })
        
        // once the admin signs the attendees address, they call this endpoint
        // and add the signature to the attendees data
        
        // if the attendee does not need any more signatures, an email will be
        // sent containing a string of signatures and instructions on how they 
        // can claim their tokens
        
        router.post("/signAttendee/:eventId", (req, res) => {
          db.signAttendee(req, res)
        })
        
        router.post("/debug", (req, res) => {
          console.log(req.body.debug)
        })
        
        // add attendee to the specified eventId
        router.post("/addattendee/:eventId", async(req, res) => {
          db.addAttendee(req, res)
        })
        
        app.use("/api", router);
    }
}