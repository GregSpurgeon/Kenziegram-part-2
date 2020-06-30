const express = require("express")
const fs = require("fs")
const multer = require("multer")
const { v4: uuidv4 } = require('uuid');


const imagePath= "./public/uploads"
const app =express()
const port =3000

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static('./public'))

app.set('views', './views')
app.set('view engine', 'pug')


const storage = multer.diskStorage({
  destination: imagePath, 
  filename: (req,file, cb) =>{
    cb(null, file.fieldname + "-" + Date.now() + uuidv4() + ".jpg")
  }
})

const upload = multer ({storage})


app.get("/", (req,res) =>{
  fs.readdir(imagePath, function (err, items){
    res.render('index',{title:"KenzieGram", images:items}
    )
  })
})

app.post("/upload", upload.single("myFile"),(req, res, next)=>{
  console.log(req.file)
  if(!req.file){
    const error = new Error("Please upload a file")
    error.httpStatusCode = 400
    return next(error)
  }
  fs.readdir(imagePath, function (err, items){
    res.render('uploads', {title:"Uploads Successful", images:items, port:port })
  })
}) 

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);