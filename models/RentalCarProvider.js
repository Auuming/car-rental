const mongoose = require('mongoose');

const RentalCarProviderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Please add a name'],
        unique: true,
        trim:true,
        maxlength:[50,'Name can not be more than 50 characters']
    },
    address:{
        type: String,
        required: [true, 'Please add an address']
    },
    tel:{
        type: String,
        required: [true, 'Please add a telephone number']
    },
}, {
    toJSON: {virtuals:true},
    toobject:{virtuals:true}
});

//Reverse populate with virtuals
RentalCarProviderSchema.virtual('bookings',{
    ref: 'Booking',
    localField: '_id',
    foreignField: 'rentalCarProvider',
    justone:false
});

module.exports=mongoose.model('RentalCarProvider',RentalCarProviderSchema);

