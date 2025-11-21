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
    telephone:{
        type:String,
        required:[true,'Please add a telephone number'],
        minlength:[10,'Telephone number must be at least 10 digits'],
        maxlength:[10,'Telephone number can not be more than 10 digits'],
        match:[/^[0-9]{10}$/,'Please add a valid telephone number (10 digits only)']
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

