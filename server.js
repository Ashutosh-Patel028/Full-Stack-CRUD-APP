const express = require("express");
const app=express();
const dotenv = require("dotenv");
var bodyParser = require("body-parser");
dotenv.config();
app.set("view engine", "ejs");

const connection = require("./config/db");

app.use(express.static(__dirname+"/public"))
app.use(express.static(__dirname+"/views"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/",(req,res)=>{
    res.redirect("/create.html")
})

app.get("/data",(req,res)=>{
    connection.query("select * from node_table",(err,rows)=>{
        if(err)
            console.log(err);
        else
            res.render("read.ejs",{rows})
    })
})

//create data
app.post("/create",(req,res)=>{
    const name=req.body.name;
    const email=req.body.email;
    try{
        connection.query("INSERT into node_table(name,email) values(?,?)",[name,email],(err,rows)=>{
            if(err)
                console.log(err);
            else
                res.redirect("/data");
        })
    }
    catch(err){
        console.log(err)
    }
})

//delete operation
app.get("/delete-data",(req,res)=>{
    const deleteQry = "delete from node_table where id=?";
    connection.query(deleteQry,[req.query.id],(err,rows)=>{
        if(err)
            console.log(err)
        else
            res.redirect("/data");
    })
})

//update operation
app.get("/update-data",(req,res)=>{
    connection.query("select * from node_table where id=?",[req.query.id],(err,eachRow)=>{
        if(err)
            console.log(err)
        else{
            result=JSON.parse(JSON.stringify(eachRow[0]))
            console.log(eachRow)
            res.render("edit.ejs",{result})
        }
    })
})

app.post("/final-update",(req,res)=>{
    const name=req.body.name;
    const email=req.body.email;
    const id=req.body.id;
    const updateQuery="UPDATE node_table set name=?, email=? where id=?";
    try{
        connection.query(updateQuery,[name,email,id],(err,rows)=>{
            if(err)
                console.log(err);
            else
                res.redirect("/data");
        })
    }
    catch(err){
        console.log(err)
    }
})

app.listen(process.env.PORT || 4000,(error)=>{
    if(error) throw error;
    else console.log(`server running on ${process.env.PORT}`)
});