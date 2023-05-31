const express= require("express");
const bodyParser= require("body-parser");
const request=require("request");
const https=require("https");
const app= express();
//app.use(express.static("public"));

app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
})
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
// __dirname, { index: 'signup.html' }
app.post("/", function(req,res){
    const firstName= req.body.fname;
    const lastName=req.body.lname;
    const email= req.body.email;
    const data ={
        members:[
            {
                email_address: email,
                status:"subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData=JSON.stringify(data);
    const url="https://us21.api.mailchimp.com/3.0/lists/247d6df4cc";
    const options ={
        method:"POST",
        auth:"dharani:15ac8667b7310a653a7697adcc8f91d1-us21"
    }
    const request= https.request(url, options, function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname +"/success.html");
        }else{
            res.sendFile(__dirname +"/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(process.env.PORT|| 3000, function(){
    console.log("Server is running on port 3000.");
})

// app.get("/", function(req,res){
//     res.sendFile(__dirname,"/signup.html");
// })
// mailchimp api key below ---- to add subcribers list 
// 15ac8667b7310a653a7697adcc8f91d1-us21

// list ID or Audience ID
//247d6df4cc
//"https://usX.api.mailchimp.com/3.0/lists/"
