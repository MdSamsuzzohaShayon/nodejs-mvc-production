const express = require("express");
const router = express.Router();
const Author = require("../models/Author");

// ALL AUTHER ROUTES
router.get("/", async (req, res, next) => {
  let searchOption = {};
    // because we are using get method to retrive the data we need to use req.query insted of req.body
    if(req.query.name != null && req.query.name != ""){
      // i (ignore case) If u flag is also enabled, use Unicode case folding.
      searchOption.name = new RegExp(req.query.name, 'i');
    }



  try{
    const authors= await Author.find(searchOption);
    console.log(authors);  
    console.log("authors from authors.js");
    console.log(req.query);    
    res.render("authors/index", {authors, searchOption: req.query});
  }catch {
    res.redirect('/');
  }
});

// NEW AUTHER ROUTE
router.get("/new", (req, res, next) => {
  res.render("authors/new", { author: new Author() });
});

router.post("/", async (req, res, next) => {
  const author = new Author({
    name: req.body.name,
  });
  try{
    const newAuthor = await author.save()  ;
          // res.redirect(`/authors/${newAuthor.id}`);
      res.redirect('/authors');  
  }catch{
    res.render(
      "authors/new",
      { author, errorMessage: "Error creating Author" },
    );
  }
  // author.save((err, newAuthor) => {
  //   if (err) {
  //     res.render(
  //       "authors/new",
  //       { author, errorMessage: "Error creating Author" },
  //     );
  //   }else{
  //     // res.redirect(`/authors/${newAuthor.id}`);
  //     res.redirect('/authors');
  //   }
  // });
  // // res.send(req.body.name);
});

module.exports = router;
