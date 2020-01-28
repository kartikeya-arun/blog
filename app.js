var express          = require("express"),
    expressSanitizer =require("express-sanitizer"),
    app              = express(),
    mongoose         = require("mongoose"),
    bodyParser       = require("body-parser"),
    methodOverride   = require("method-override");

// mongoose.connect("mongodb://localhost:27017/restful_blog",{useNewUrlParser: true});
mongoose.connect("mongodb+srv://dbuser1:securedaccount@cluster0-87iqw.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser: true});

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var blogSchema=new mongoose.Schema({
    title   : String,
    image   : String,
    body    : String,
    Created : {type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);

Blog.create({
    title:"Test post",
    image:"https://images6.alphacoders.com/815/thumb-1920-815168.jpg",
    body:"'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec congue purus bibendum ipsum ultricies volutpat. Duis et scelerisque orci. In et arcu mauris. Praesent rutrum enim a dui pulvinar, at eleifend arcu sagittis. Aenean a libero est. Maecenas fermentum rutrum ex, at posuere nisi elementum eu. Mauris ut egestas nunc. Quisque varius finibus lorem, in blandit felis varius nec. Quisque scelerisque tempus nisi. Curabitur aliquam maximus massa eu ultricies. Vivamus dui massa, laoreet in viverra sit amet, sodales et magna. Duis ut nibh velit."
});

app.get("/",(req,res)=>{
    res.redirect("/blogs");
})
app.get("/blogs/new",(req,res)=>{
    res.render("new")
});
app.post("/blogs",(req,res)=>{
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,(err,newBlog)=>{
        if(err){
            res.render("new");
        }
        else{
            res.redirect("/");
        }
    })
})
app.get("/blogs",(req,res)=>{
   Blog.find({},(err,blogs)=>{
       if(err){
           console.log(err);
       }
       else{
           res.render("index",{blogs:blogs});
       }
   })
});
app.get("/blogs/:id",(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){
            console.log(err)
        }
        else{
            res.render("show",{blog:foundBlog})
        }
    })
})
app.get("/blogs/:id/edit",(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){
            res.render("/")
        }
        else{
            res.render("edit",{blog:foundBlog})
        }
    })
})
app.put("/blogs/:id",(req,res)=>{
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,updatedBlog)=>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
})
app.delete("/blogs/:id",(req,res)=>{
    Blog.findByIdAndRemove(req.params.id,(err)=>{
        if(err){
            res.redirect("/");
        }
        else{
            res.redirect("/");
        }
    })
})

var port=process.env.PORT||3000;

app.listen(port,process.env.IP, ()=>{
    console.log("Blog App server Has Started");
})