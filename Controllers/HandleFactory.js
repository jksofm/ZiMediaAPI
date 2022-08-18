import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import APIFeatures from "../utils/APIFeatures.js";

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
  

    if(req.file) req.body.image = req.file.filename
   
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });
export const getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    const doc = await query;
    if (!doc) return next(new AppError("No document found with that id", 404));
    res.status(200).json({
      status: "success",

      data: {
        data: doc,
      },
    });
  });
export const getAll = (Model,populateOptions) =>
  catchAsync(async (req, res, next) => {
    // console.log(req.query);

    let filter = {};
    if(req.params.userId){
       filter = {userId : req.params.userId};
    }
    // console.log(postId)
    console.log("hello")
    console.log(req.params.postIdComment)
    if(req.params.postIdComment){
      filter.postId = req.params.postIdComment
    }
  
    if(req.query.q){
      const query =   req.query.q;

      filter.username = { $regex: query, $options: 'i' }
      
    }
    console.log("filter",filter)
    let filterFeatures;
    if(populateOptions){

       filterFeatures = new APIFeatures(Model.find(filter).populate(populateOptions), req.query)
        .filter()
        .fields()
        .sort()
        .limit();
    }else{

      filterFeatures = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .fields()
      .sort()
      .limit();
    }
   
    const doc = (await filterFeatures.query).sort((a,b)=>b.createdAt -a.createdAt);
    
    res.status(200).json({
      status: "success",
      requestTime: req.requestTime,
      results: doc.length,
      data: {
        doc,
      },
    });
  });
export const deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if(!doc){
     
        return next(new AppError("No document found with that id",404));
      }
    
      res.status(200).json({
        status: 'success',
      });
})
export const updateOne = Model => catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if(!document){
        return next(new AppError("No document found with that id",404));
      }
    
      res.status(200).json({
        status: 'success',
        data: {
          data: document,
        },
      });
})
