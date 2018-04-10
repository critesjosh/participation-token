// grab the things we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create a schema
var eventSchema = new Schema({
  title: String,
  eventCreator: String,
  eventNonce: Number,
  eventCreated: Date,
  attendees: Array,
  admins: Array,
  tokenAmount: Number
});

// the schema is useless so far
// we need to create a model using it
var Event = mongoose.model('Event', eventSchema);

// make this available to our users in our Node applications
module.exports = Event;