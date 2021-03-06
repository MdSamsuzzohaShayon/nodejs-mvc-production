const express = require("express");
const router = express.Router();
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
const Book = require("../models/Book");
const Author = require("../models/Author");
// const { fileLoader } = require("ejs");

const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];

// const uploadPath= path.join('public', Book.coverImageBasePath);
//
// we are no longer going to use multer
// const upload = multer({
//   dest: uploadPath,
//   fileFilter: (req, file, callback)=>{
//     callback(null, imageMimeTypes.includes(file.mimetype) );
//   }
// });

// ALL Book ROUTES
router.get("/", async (req, res, next) => {
  let query = Book.find();
  if (req.query.title != null && req.query.title != "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
    // less than or equal to
    // https://mongoosejs.com/docs/2.7.x/docs/query.html
    query = query.lte("publishDate", req.query.publishedBefore);
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
    // less than or equal to
    // https://mongoosejs.com/docs/2.7.x/docs/query.html
    query = query.gte("publishDate", req.query.publishedAfter);
  }
  try {
    const books = await query.exec();
    res.render("books/index", {
      books,
      searchOption: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// NEW BOOK ROUTE
router.get("/new", async (req, res, next) => {
  renderNewPage(res, new Book());
});

// CREATE BOOK ROUTE
// router.post("/", upload.single('cover'), callback) // by using multer

router.post("/", async (req, res, next) => {
  // const fileName= req.file !=null ? req.file.filename : null;
  const { title, author, publishDate, pageCount, cover, description } =
    req.body;
  console.log(
    "All the input value are: ",
    title,
    author,
    publishDate,
    pageCount,
    description,
  );

  const book = new Book({
    title,
    author,
    publishDate: new Date(publishDate),
    pageCount,
    // coverImageName: fileName,
    description,
  });

  saveCover(book, cover);

  try {
    const newBook = await book.save();
    console.log(newBook);

    res.redirect(`/books/${newBook.id}`);
    // res.redirect("/books");
  } catch {
    // IF ALL DATA DOESN'T SAVE SUCCESSFULLY AND GIVE US AN ERROR THAT WE ARE GOING TO SAVE THIS BOOK COVER WILL BE REMOVE
    // if(book.coverImageName != null){
    //   removeBookCover(book.coverImageName);
    // }
    renderNewPage(res, book, true);
    // console.log("error ");
    // res.redirect('books')
  }
});

// function removeBookCover(fileName){
//   fs.unlink(path.join(uploadPath, fileName), (err)=>{
//     if(err) console.error(err);
//   });
// }

router.get("/:id", async (req, res, next) => {
  try {
    // const book = await Book.findById(req.params.id) ;  // BY USING THIS WE ARE ONLY ABLE TO ACCESS THE ID OF AUTHOR IN ORDER TO GET ALL INFORMATION ABOUT AIUTHOR WE NEED TO USE POPULATE
    const book = await Book.findById(req.params.id).populate("author").exec();
    res.render("books/show", { book });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// EDIT BOOK ROUTE
router.get("/:id/edit", async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    renderEditPage(res, book);
  } catch {
    res.redirect("/");
  }
});

// UPDATE BOOK ROUTE
router.put("/:id", async (req, res, next) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    book.title = req.body.title;
    book.author = req.body.author;
    book.publishDate =new Date( req.body.publishDate);
    book.pageCount = req.body.pageCount;
    book.description = req.body.description;

    // OVERRIDING COVER IF USER PASS NEW COVER AND PREVENT DELETE COVER
    if(req.body.cover != null && req.body.cover !== ''){
      saveCover(book, req.body.cover);
    }
    await book.save();
    res.redirect(`/books/${book.id}`);
  } catch (err) {
    console.log( err);
    
    if(book != null){
      renderEditPage(res, book, true);
    }else{
      res.redirect('/');
    }
  }
});


router.delete('/:id', async (req, res, next)=>{
  let book;
  try {
    book = await Book.findById(req.params.id);
    await book.remove();
    res.redirect('/books');
  } catch (error) {
    console.log(error);
    
    if(book != null){
      res.render("/books/show", {
        book,
        errorMessage: "could not remove the book"
      })
    }else{
      res.redirect('/');
    }
  }
});



async function renderNewPage(res, book, hasError = false) {
  renderFormPage(res, book, "new", hasError);
}

async function renderEditPage(res, book, hasError = false) {
  renderFormPage(res, book, "edit", hasError);
}

async function renderFormPage(res, book, form, hasError = false) {
  try {
    const authors = await Author.find({});
    const { title, author, publishDate, pageCount, description } = book;
    console.log(
      "All the input value are from render page: ",
      title,
      author,
      publishDate,
      pageCount,
      description,
    );

    const params = {
      authors,
      book,
    };
    if(hasError){
      if(form === "edit"){
        params.errorMessage = "error editing book";
      }else{
        params.errorMessage = "error creating  book";
      }
    }
    res.render(`books/${form}`, params);
  } catch {
    res.redirect("/books");
  }
}

function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    // https://nodejs.org/api/buffer.html
    book.coverImage = new Buffer.from(cover.data, "base64");
    book.coverImageType = cover.type;
  }
}

module.exports = router;
