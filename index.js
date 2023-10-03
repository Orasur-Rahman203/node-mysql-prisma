const express = require("express");
const app = express();
const { PrismaClient, Prisma } = require("@prisma/client")
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

app.get("/", async (req, res) => {
    let data = await prisma.user.findMany()
    res.json({ "userlist": data })
    // res.json("userlist")
})


app.post("/", async (req, res) => {

    const { id, firstName, lastName, age } = req.query
    let data = await prisma.user.create({
        data: {
            firstName: firstName,
            lastName: lastName,
            age: parseInt(age),
            nickName: "hello"
            
        }
    })

    // prisma.user.createMany(])
    res.json({ "message": "created" })
})


app.patch("/", async (req, res) => {

    const { id, firstName, lastName, age } = req.query

    let data = await prisma.user.update({
        where: {
            id: parseInt(id)
        }, data: {
            firstName: firstName,
            lastName: lastName,
            age: parseInt(age)
        }
    })

    res.json({ "message": "updated" })

})


app.delete("/", async (req, res) => {
    const { id } = req.query

    let data = await prisma.user.delete({
        where: {
            id: parseInt(id)
        }
    })

    res.json({ "message": "deleted" })

})

app.listen(3005, () => console.log(`Server is running on port ${3005}`));


