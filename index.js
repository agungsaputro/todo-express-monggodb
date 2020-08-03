const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const TodoModel = require('./models/todoModel');

dotenv.config();

app.use("/static",express.static("public"));

app.use(express.urlencoded({ extended: true }));

mongoose.set("useFindAndModify", false);

mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true},() =>{
    console.log("succes connected to db");
    app.listen(3000, () => console.log("Server Up and running"));
})

app.set("view engine","ejs");

app.get('/',(req, res) => {
    TodoModel.find({}, (err, task) =>{
        res.render('todo.ejs', {todoModel: task});
    });
    
});

app.post('/',async (req,res) =>{
    const todoModel = new TodoModel({
        content: req.body.content
    });
    try{
        await todoModel.save();
        res.redirect("/");
    }catch(err){
        res.redirect("/");
    }
});

app
    .route("/edit/:id")
    .get((req,res) =>{
        const id =req.params.id;
        TodoModel.find({}, (err, tasks) =>{
            res.render("edit.ejs",{todoModel:tasks, idTask: id})
        });
    })
    .post((req, res) =>{
        const id = req.params.id;
        TodoModel.findByIdAndUpdate(id, {content: req.body.content}, err =>{
            if(err) return res.send(500,err);
            res.redirect("/");
        });
    });

app
    .route("/remove/:id")
    .get((req,res) =>{
        const  id = req.params.id;
        TodoModel.findByIdAndDelete(id, err =>{
            if(err) return res.send(500,err);
            res.redirect("/");
        });
    });



