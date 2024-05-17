const Book = require('../models/crud')
const {StatusCodes}=require('http-status-codes')

const getAllbooks = async(req,res)=>{

    try{
        const books = await Book.find({});
        res.status(StatusCodes.OK).json({books});

    }catch(error){
        console.error('Error fetching books:',error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:'Internal Server Error'});

    }
 }

const createbook = async(req,res)=>{
  try{
    if(!req.body || Object.keys(req.body).length === 0){
        return res.status(StatusCodes.BAD_REQUEST).json({error:'Request body is empty'});
    }

    const book = await Book.create(req.body)
    res.status(StatusCodes.CREATED).json({message:'Book created successfully', book});
  }catch (error){
    console.error('Error creating book:',error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:'Internal Server Error'});
 }

    
}


const getbook = async(req,res)=>{
    try {
        const {id} = req.params
        const book = await Book.findById(id);
        if(!book){
            return res.status(StatusCodes.NOT_FOUND).json({error:'Book not found'});
        }
        res.status(StatusCodes.OK).json({book})

    }catch(error){
        console.error(`Error fetching book with id ${id}:`,error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:'Internal server error'});

    }
   
}

const updatebook=async(req,res)=>{
    try{
        const {id} = req.params 
        const book= await Book.findByIdAndUpdate(id,req.body,{new:true})

        if(!book){
            return res.status(StatusCodes.NOT_FOUND).json({error:'Book not found'});
        }
   
        res.status(StatusCodes.OK).json({book})

    }catch(error){
        console.error(`Error updating book with id ${id}:`, error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:'Internal server error'});

    }
   
}

const deletebook = async(req,res)=>{
    try{
        const {id} = req.params
        const book= await Book.findOneAndDelete({_id:id});

        if(!book){
            return res.status(StatusCodes.NOT_FOUND).json({error:'Book not found'});
        }
        res.status(StatusCodes.OK).json({message:"book deleted successfully"});


    }catch(error){
        console.error(`Error deleting book with id ${id}:`,error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:'Internal server error'});
    }
    
    
}


    module.exports={getAllbooks,createbook,getbook,updatebook,deletebook}