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


const storage = multer.diskStorage({
  destination: imagePath, 
  filename: (req,file, cb) =>{
    cb(null, file.fieldname + "-" + Date.now() + uuidv4() + ".jpg")
  }
})

const upload = multer ({storage})

const displayImages = (images)=>{
  let imageContainer=``
  for (let i=0; i<images.length; i++){
    let url=`http://localhost:${port}/uploads/${images[i]}`
    imageContainer += `<img style="width: 400px" src="${url}"/>`
  }
  return imageContainer
}

app.get("/", (req,res) =>{
  fs.readdir(imagePath, function (err, items){
    // console.log(items)
    res.send(`
        <h1>KenzieGram</h1>
        <form action="/upload" method="post" enctype="multipart/form-data">
            <input type="file" name="myFile" />
            <button type="submit">Upload Image</button>
        </form>
        <br/>
        ${displayImages(items)}`
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
    let imageUpload=`<img style="width: 400px" src="/uploads/${items[items.length -1]}"/>`
    console.log(imageUpload)
    res.send(
      `
      <h1>Upload successful</h1>
      <a href="http://localhost:${port}">Home</a>
      <br/>
      ${imageUpload}
    `)
  })
}) 

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);