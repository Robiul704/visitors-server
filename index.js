const express = require('express')
const cors=require('cors')
const app = express()
const jwt=require('jsonwebtoken')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 5000


// midlewer 
app.use(cors({
  origin:[`http://localhost:5173`],
  credentials:true
}))
app.use(express.json())
app.use(cookieParser())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@robiul.13vbdvd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const logger=async(req,res,next)=>{
  next()
}

const varyfytoken=async(req,res,next)=>{
  const token=req.cookies?.token
  console.log('value of token',token)
  if(!token){
    return res.status(401).send({message:'not authoriszed'})
  }
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
    if(err){
      console.log(err)
      return res.status(401).send({message:' its unauthoriszed'})
    }
     req.user=decoded
    console.log('this is authoriszed',decoded)
    next()
  })
}

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const blogscollection=client.db('Blog_DB').collection('BlogUser')
    const wishlistcollection=client.db('Blog_DB').collection('wishlist')
    const commentscollection=client.db('Blog_DB').collection('comments')

app.post('/blogs',async(req,res)=>{
    const blogs=req.body
    console.log(blogs)
    const result=await blogscollection.insertOne(blogs)
    res.send(result)
})
app.get('/blogs',async(req,res)=>{
  
    const result=await blogscollection.find().toArray()
    res.send(result)
})

app.get('/blogs/:id',async(req,res)=>{
    const id=req.params.id
    const filter={_id:new ObjectId(id)}
    const result=await blogscollection.findOne(filter)
    res.send(result)
})
app.get('/wishlist/:id',async(req,res)=>{
    const id=req.params.id
    const filter={_id:new ObjectId(id)}
    const result=await wishlistcollection.findOne(filter)
    res.send(result)
})

app.post('/wishlist',async(req,res)=>{
    const data=req.body
    const result=await wishlistcollection.insertOne(data)
    res.send(result)
})

app.delete('/wishlist/:id',async(req,res)=>{
  const id=req.params.id
  const filter={_id:new ObjectId(id)}
  const result=await wishlistcollection.deleteOne(filter)
  res.send(result)
})

app.get('/wishlist',async(req,res)=>{
    const result=await wishlistcollection.find().toArray()
    res.send(result)
})
app.post('/comments',async(req,res)=>{
    const filter=req.body
    const result=await commentscollection.insertOne(filter)
    res.send(result)
})
app.get('/comments',async(req,res)=>{
    const result=await commentscollection.find().toArray()
    res.send(result)
})

app.get('/comments/:id',async(req,res)=>{
  const id=req.params.id
  const filter={id:id}
    const result=await commentscollection.find(filter).toArray()
    res.send(result)
})


app.get('/update/:id',async(req,res)=>{
    const id=req.params.id
    const filter={_id:new ObjectId(id)}
    const result=await blogscollection.findOne(filter)
    res.send(result)
})

app.post('/jwt',logger ,async(req,res)=>{
  const user=req.body
  console.log(user)
  console.log(user)
  const token=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'})
  res
  .cookie('token',token,{
    httpOnly:true,
    secure:false
  })
  .send({success:true})
})


// app.put('/blogs/:id',async(req,res)=>{
//     const id=req.params.id
//     const filter={_id:new ObjectId(id)}
//     const option={upsert:true}
//     const body=req.body

//     const updatenew={
//         $set:{
//             title:body.title,
//             category:body.category,
//             shortdescription:body.shortdescription,
//             longdescription:body.shortdescription,
//             image:body.image
//         }
//     }
//     const result=await blogscollection.updateOne(filter,option,updatenew)
//     res.send(result)
  
// })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})