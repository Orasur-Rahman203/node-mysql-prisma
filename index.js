const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient();

async function checkDbCOnnection() {
    await prisma.$connect().then(() => {
        console.log("DB connection established")
    }).catch(() => {
        console.log("Error connecting DB")
    })
}

checkDbCOnnection()

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.get("/", async(req, res)=>{
    let data=await prisma.user_info.findMany()
    res.json({"UserList": data})
})
app.get("/:id", async(req, res)=>{
    const uid=req.params.id;
    let data=await prisma.user_info.findUnique({
        where:{
            uid:parseInt(uid)
        }
    })
    res.json({"user data": data})
})

app.post("/", async(req, res)=>{
    const { email, password}=req.query
    let data=await prisma.user_info.create({
        data:{
            email:email,
            password:password,
        }
    })
    res.json({"message":"successfully created", data})
})

app.patch("/:id", async(req, res)=>{
    const uid=req.params.id;
    const {email}=req.query;
    const result=await prisma.user_info.update({
        where:{uid:parseInt(uid)},
        data:{
            email:email,
        }
    })
    res.json({"message":"successfully updated", result})

})


app.delete("/:id", async(req, res)=>{
    const uid=req.params.id;
    let data=await prisma.user_info.delete({
        where:{
            uid:parseInt(uid)
        }
    })
    res.json({"message":"successfully deleted",data}) 
})


app.listen(3001, () => console.log(`Server is running on port ${3001}`));
