const mongoose = require("mongoose");
const assert = require("assert");

mongoose.Promise = global.Promise;

before(function(done) {
    mongoose.connect("mongodb://192.168.100.100:27020");
    mongoose.connection
        .once("open", function() {
            done();
        })
        .on("error", function(error) {
            console.warn("Warning", error);
        });
});

const Schema = mongoose.Schema;
const CrimeSchema = new Schema({
    nm_pol: String,
    lati: Number,
    long: Number,
    mag: Number
});

const CrimeRecord = mongoose.model("crime_record", CrimeSchema);

describe("Reading crime records from the database", function() {
    var savedRecord;

    beforeEach(function(done) {
        savedRecord = new CrimeRecord({
            nm_pol: "Sample Area",
            lati: 28.6139,
            long: 77.2090,
            mag: 2
        });

        savedRecord.save().then(function() {
            done();
        });
    });

    it("finds a record by police area", function(done) {
        CrimeRecord.findOne({ nm_pol: "Sample Area" }).then(function(record) {
            assert(record._id.toString() === savedRecord._id.toString());
            done();
        });
    });
});

afterEach(function(done) {
    mongoose.connection.collections.crime_records.drop(function() {
        done();
    });
});
