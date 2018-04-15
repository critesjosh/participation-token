// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var attendeeSchema = new Schema({
    ethAddress: String,
    admins: Array,       // keep track of which Admins sign for the attendee
    signatures: Array,   // keep track of the signatures
    email: String,
    eventId: String,
    userId: String
});

// the schema is useless so far
// we need to create a model using it
var Attendee = mongoose.model('Attendee', attendeeSchema);

// make this available to our users in our Node applications
module.exports = Attendee;