const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Book = require("../models/Book");
const Author = require("../models/Author");
// const { fileLoader } = require("ejs");


const uploadPath= path.join('public', Book.coverImageBasePath);
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback)=>{
    callback(null, imageMimeTypes.includes(file.mimetype) );
  }
});




// ALL Book ROUTES
router.get("/", async (req, res, next) => {
  try{
    const books = await Book.find({});
    res.render('books/index', {
      books ,
      searchOption: req.query
    });
  }catch{
    res.redirect('/');
  }
});

// NEW BOOK ROUTE
router.get("/new", async (req, res, next) => {
  renderNewPage(res, new Book());
});

// CREATE BOOK ROUTE
router.post("/", upload.single('cover'), async (req, res, next) => {
  const fileName= req.file !=null ? req.file.filename : null;
  const {title, author, publishDate, pageCount, description} = req.body;
  console.log("All the input value are: ", title, author, publishDate, pageCount, description);
  
  const book = new Book({
    title,
    author,
    publishDate: new Date(publishDate),
    pageCount,
    coverImageName: fileName,
    description,
  });
  try {
    const newBook = await book.save(); 
    console.log(newBook);
    
    // res.redirect(`books/${newBook.id}`);
    res.redirect('/books')
  } catch {
    // IF ALL DATA DOESN'T SAVE SUCCESSFULLY AND GIVE US AN ERROR THAT WE ARE GOING TO SAVE THIS BOOK COVER WILL BE REMOVE 
    if(book.coverImageName != null){
      removeBookCover(book.coverImageName);
    }
    renderNewPage(res, book, true);
    // console.log("error ");
    // res.redirect('books')
  }
});

function removeBookCover(fileName){
  fs.unlink(path.join(uploadPath, fileName), (err)=>{
    if(err) console.error(err);
  });
}



async function renderNewPage(res, book, hasError=false){
  try {
    const authors = await Author.find({});
    const {title, author, publishDate, pageCount, description} = book;
    console.log("All the input value are from render page: ", title, author, publishDate, pageCount, description);
    
    const params = {
      authors,
      book
    }
    if(hasError) params.errorMessage = "error creating book";
    res.render('books/new', params);
  } catch  {
    res.redirect('/books')
  }
}

module.exports = router;






























