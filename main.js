const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const port = 3200;

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

//misc
// var tasks=[];
// const item1="Create Project";
// const item2="Do DSA";
// const item3="Workout";
// tasks.concat(item1);
// tasks.concat(item2);
// tasks.concat(item3);


//mongodb
mongoose.connect("mongodb://localhost:27017/todolistDB");

//creating mongoose schema
const taskSchema ={
    task: String
};

//mongoose model or collection
const Task = mongoose.model(
    "Task",
    taskSchema
);

//mongoose document
// const task1 = new Task({
//     task: "Go to Gym"
// })
// const task2 = new Task({
//     task: "Work on project"
// })
// const task3 = new Task({
//     task: "be grateful"
// })


// const defaultTasks = [task1,task2,task3];

// Task.insertMany(defaultTasks)
// since we are getting multiple copies of the data in our db at each server run, we will put an if statement in app.get, task.find method. that is if founditems list is empty then only add default items to the list
// try{
//     Task.insertMany(defaultTasks);
//     console.log("Successfully added default items to DB");
// }catch(err){
//     console.log(err);
// }


function findday() {
    let date = new Date();
    let today = date.getDay();
    let day;

    switch (today) {
        case 0:
            day = "Sunday";
            break;
        case 1:
            day = "Monday";
            break;
        case 2:
            day = "Tuesday";
            break;
        case 3:
            day = "Wednesday";
            break;
        case 4:
            day = "Thursday";
            break;
        case 5:
            day = "Friday";
            break;
        case 6:
            day = "Saturday";
    }
    return day;
}

app.get("/", (req, res) => {
    //res.send("<h1>Home</h1>");
    let day = findday();
    //res.send(`<h1>${day}'s To Do List</h1>`);

    //mongoose find
    // const founditems = Task.find({}).orFail(new Error('No docs found!'));
    //var founditems = Task.find({});

    Task.find({})
    .then(founditems => {
        if(founditems.length===0){
            try{
                Task.insertMany(defaultTasks);
                console.log("Successfully added default items to DB");
            }
            catch(err){
                console.log(err);
            }
            res.redirect("/");
        }
        else{
            res.render('list', { _day: day, _tasks: founditems });
        }
      
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("Error retrieving tasks from database.");
    });
    // Task.find({},function(err,founditems){
    //     if(err)
    //         console.log(err);
    //     else
    //         console.log(founditems);
    // })


    // res.sendFile(__dirname+"/index.html") using this we can send index.html files
    // res.render('list',{_day:day, _tasks:tasks});

    // res.render('list',{_day:day, _tasks:founditems})
});

app.post("/",(req,res)=>{
    var taskName = req.body.newItem;
    console.log(taskName);

    const newTask = new Task({
        task: taskName
    });

    newTask.save();

    // tasks.push(task);
    // console.log(task);
    //res.send("Form submitted successfully")

    //trying to send data to mongo directly
    // try{
    //     Task.insertOne(task);
    //     console.log("Successfully aaded task to DB");
    // }catch(err){
    //     console.log(err);
    // }

    res.redirect("/");
})
app.post("/delete",async (req,res)=>{
    // console.log(req.body.checkbox);
    const checkedTaskId = req.body.checkbox;
    // Task.deleteOne(checkedTaskId);
    // console.log(`${checkedTaskId} deleted`);
    // Task.findByIdAndDelete(checkedTaskId,(err)=>{
    //     if(err)
    //         console.log(err);
    //     else
    //         console.log(`${checkedTaskId} deleted`);
    // })
    try {
        await Task.findByIdAndDelete(checkedTaskId);
        console.log(`${checkedTaskId} deleted`);
      } catch (err) {
        console.error(err);
      }
      res.redirect("/");
})

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server is listening on port ${port}`);
    }
});
