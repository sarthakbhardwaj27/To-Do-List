const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
let ejs = require("ejs");

const app = express();
// var items = [];
// let workItems = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("public", { "Content-Type": "text/css" }));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
});
const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todoList",
});

const item2 = new Item({
  name: "Hit the plus button to add a new item",
});

const item3 = new Item({
  name: " Hit this button to delete",
});

const defaultItems = [item1, item2, item3];

// Item.insertMany(defaultItems, function(err){
//   if(err){
//     console.log(err);
//   }else{
//     console.log("Successfully saved default items to DB.");
//   }
// })
// insertmany no longer accepts a callback

try {
  const result = Item.insertMany(defaultItems);
  console.log(`${result.insertedCount} documents inserted`);
} catch (error) {
  console.error(error);
}


// app.get("/",function(req,res){
//     var today = new Date();
//     var currentday = today.getDay();

//     if(currentday === 6 || currentday === 0)
//         res.send("it is a weekend");
//     else{
//         // res.send("arghh go to work");
//         res.sendFile(__dirname+"/index.html");
//     }

//     // if(currentday===6 || currentday===0){
//     //     res.send("<h1>yayyy chutti haiii</h1>")
//     // }
//     // else{
//     //     res.write("Today is working day");
//     //     res.write("booo i have to work");
//     //     res.send();
//     // }
// });

app.get("/", (req, res) => {
  var today = new Date();
  var currentday = today.getDay();
  var day = "";

  //   switch (currentday) {
  //     case 0:
  //       day = "Sunday";
  //       break;
  //     case 1:
  //       day = "Monday";
  //       break;
  //     case 2:
  //       day = "Tuesday";
  //       break;
  //     case 3:
  //       day = "Wednesday";
  //       break;
  //     case 4:
  //       day = "Thursday";
  //       break;
  //     case 5:
  //       day = "Friday";
  //       break;
  //     case 6:
  //       day = "Saturday";
  //   }
  //https://stackoverflow.com/questions/3552461/how-do-i-format-a-date-in-javascript
  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  var today = new Date();

  day = today.toLocaleDateString("en-US", options); // Saturday, September 17, 2016

  // Item.find({}).exec();

  

  Item.find({}).then(function (foundItems) {
    if(foundItems.length === 0){
      Item.insertMany(defaultItem);
      res.render("list", { _listTitle: "Today", newListItems: foundItems });
    }else{
      res.render("list", { _listTitle: "Today", newListItems: foundItems });
    }
    }).catch(function (err) {
      console.log(err);
  }); 
});
  //res.render("list", { _listTitle: day , newListItems: items});
// });

app.get("/work", (req, res) => {
  res.render("list", { _listTitle: "Work List", newListItems: workItems });
});

// app.post("/work",(req,res)=>{
//   let item = req.body.newItem;
//   workItems.push(item);
//   res.redirect("/work");
// })

app.post("/", (req, res) => {
  var item = req.body.newItem;
  // console.log(item);
  console.log(req.body);
  if (req.body.button === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server is now started on port 3000");
});
