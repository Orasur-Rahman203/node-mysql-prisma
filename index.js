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

app.get("/api/users", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
        const data = await prisma.user_info.findMany({
            skip,
            take: limit,
        });
        res.json({ "UserList": data });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}).post("/api/users", async(req, res)=>{
    const {fullName, email, password}=req.query
    let data=await prisma.user_info.create({
        data:{
            fullName:fullName,
            email:email,
            password:password,
        }
    })
    res.json({"message":"successfully created", data})
})

app.get("/api/users/:id", async(req, res)=>{
    const uid=req.params.id;
    let data=await prisma.user_info.findUnique({
        where:{
            uid:parseInt(uid)
        }
    })
    res.json({"user data": data})
})

app.patch("/api/users/:id", async(req, res)=>{
    const uid=req.params.id;
    const {fullName, email}=req.query;
    console.log(fullName, email);
    const result=await prisma.user_info.update({
        where:{uid:parseInt(uid)},
        data:{
            fullName:fullName,
            email:email,
        }
    })
    res.json({"message":"successfully updated", result})

})

app.delete("/api/users/:id", async(req, res)=>{
    const uid=req.params.id;
    let data=await prisma.user_info.delete({
        where:{
            uid:parseInt(uid)
        }
    })
    res.json({"message":"successfully deleted",data}) 
})


app.listen(8000, () => console.log(`Server is running on port ${8000}`));
