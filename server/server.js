import express from 'express'
import dotenv from 'dotenv'
import Groq from 'groq-sdk'

dotenv.config()
console.log("DEBUG: env key =", process.env.GROQ_API_KEY);
const app = express()
app.use(express.json())

const groq = new Groq({apiKey:process.env.GROQ_API_KEY})

app.post('/api/chat',async(req,res)=>{
  try{
    const { message } = req.body;
    
    const chatCompletion = await groq.chat.completions.create({
      messages:[{role:"user",content:message}],
      model:"llama-3.1-8b-instant"
    })
    
    res.json({reply:chatCompletion.choices[0]?.message?.content || ""})
    
  }catch(err){
    console.log("error server.js: ",err)
  }
})

const port = 8080
app.listen(port,()=>{
  console.log('listening on port:',port)
  console.log('api key',process.env.GROQ_API_KEY)
})