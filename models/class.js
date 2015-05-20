var mongoose = require('mongoose');
//var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/elearn');

var db = mongoose.connection;

// User Schema
var ClassSchema = mongoose.Schema({
	title: {
		type: String
	},
	description:{
		type: String
	},
	instructor: {
		type:String
	},
	lessons:[{
		lesson_number: {type:Number},
                lesson_title: {type:String},
                lesson_body: {type:String}
        }]
});

// Training: Instantiation of User as a mongoose instance
var Class = module.exports = mongoose.model('Class', ClassSchema);


// Training: Fetch all Classes
module.exports.getClasses = function(callback, limit) {
	Class.find(callback).limit(limit);
	};
