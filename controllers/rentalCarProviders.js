const RentalCarProvider = require('../models/RentalCarProvider');
const Appointment = require('../models/Appointment');

function transformQuery(input) {
  const output = {};
  for (const key in input) {
    const match = key.match(/^(\w+)\[(\w+)\]$/);
    if (match) {
      const field = match[1];
      const operator = match[2];
      output[field] = { [`$${operator}`]: input[key] };
    } else {
      output[key] = input[key];
    }
  }
  return output;
}

//@desc Get all rental car providers
//@route GET /api/v1/rentalCarProviders
//@access Public
exports.getRentalCarProviders = async(req,res,next) => {
    let query;

    //Copy req.query
    const reqQuery= {...req.query};

    //Fields to exclude
    const removeFields=['select', 'sort', 'page', 'limit'];

    //Loop over remove fields and delete them from reqQuery
    removeFields.forEach(param=>delete reqQuery[param]);

    //Create query string
    let queryStr = JSON.stringify(req.query);

    // queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    queryStr = queryStr.replace(/"(\w+)\[(\w+)\]":\s*"([^"]+)"/g, (_, field, op, value) => `"${field}":{"$${op}":"${value}"}`);

    //finding resource
    query = RentalCarProvider.find(JSON.parse (queryStr)).populate('bookings');

    //Select Fields
    if(req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    //Sort
    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    //Pagination
    const page = parseInt(req.query.page,10) || 1;
    const limit = parseInt(req.query.limit,10) || 25;
    const startIndex = (page-1)*limit;
    const endIndex = page*limit;
    const total = await RentalCarProvider.countDocuments();
    query = query.skip(startIndex).limit(limit);

    try {
        //Executing query
        const rentalCarProviders = await query

        //Pagination result
        const pagination = {};
        if (endIndex < total) {
            pagination.next = {
                page: page+1,
                limit
            }
        }
        if (startIndex > 0) {
            pagination.prev = {
                page: page-1,
                limit
            }
        }

        //Success response
        res.status(200).json({success:true, count:rentalCarProviders.length, pagination, data:rentalCarProviders});
    } catch(err) {
        res.status(400).json({success:false, error:err});
    }
};

//@desc Get single rental car provider
//@route GET /api/v1/rentalCarProviders/:id
//@access Public
exports.getRentalCarProvider = async(req,res,next) => {
    try {
        const rentalCarProvider = await RentalCarProvider.findById(req.params.id);
        if (!rentalCarProvider) {
            return res.status(400).json({success:false, error:"not exist"});
        }
        res.status(200).json({success:true, data:rentalCarProvider});
    } catch(err) {
        res.status(400).json({success:false, error:err});
    }
};

//@desc Create new rental car provider
//@route POST /api/v1/rentalCarProviders
//@access Private
exports.createRentalCarProvider = async(req,res,next) => {
    const rentalCarProvider = await RentalCarProvider.create(req.body);
    res.status(201).json({
        success: true,
        data: rentalCarProvider
    });
};

//@desc Update rental car provider
//@route PUT /api/v1/rentalCarProviders/:id
//@access Private
exports.updateRentalCarProvider = async(req,res,next) => {
    try {
        const rentalCarProvider = await RentalCarProvider.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!rentalCarProvider) {
            return res.status(400).json({success:false, error:"not exist"});
        }
        res.status(200).json({success:true, data:rentalCarProvider});
    } catch(err) {
        res.status(400).json({success:false, error:err});
    }
};

//@desc Delete rental car provider
//@route DELETE /api/v1/rentalCarProviders/:id
//@access Private
exports.deleteRentalCarProvider = async(req,res,next) => {
    try {
        const rentalCarProvider = await RentalCarProvider.findById(req.params.id);
        if (!rentalCarProvider) {
            return res.status(400).json({success:false, message:`Rental car provider not found with id of ${req.params.id}`});
        }
        await Appointment.deleteMany({ hospital: req.params.id });
        await RentalCarProvider.deleteOne({_id:req.params.id});
        res.status(200).json({success:true, data:{}});
    } catch(err) {
        res.status(400).json({success:false, error:err});
    }
};

