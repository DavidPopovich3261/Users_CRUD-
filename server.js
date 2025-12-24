import express from "express"
import { promises as fs } from "fs"
import { json } from "stream/consumers"

const app = express()
const port = 8080
app.use(express.json())

app.get("/users", async (req, res) => {
    try {
        let data = await fs.readFile("./users.json", "utf8")
        res.json(JSON.parse(data))
    } catch (err) {
        res.json(err)
    }
})


app.get("/users/:id", async (req, res) => {
    try {
        let data = await fs.readFile("./users.json", "utf8")
        data = JSON.parse(data)

        let dataById = await data.filter((user) => {
            if (user.id == req.params.id) {
                return true
            }
        })
        if (dataById[0] != undefined) {
            res.json(dataById)
        } else {
            res.status(404).send("not found")
        }
    } catch (err) {
        res.json(err)
    }
})

app.post("/users", async (req, res) => {
    try {
        let data = await fs.readFile("./users.json", "utf8")
        data = await JSON.parse(data)
        const newId = data[(data.length - 1)].id;
        let user = await req.body
        user.id = parseInt(newId) + 1
        await data.push(user)
        data = JSON.stringify(data)
        await fs.writeFile("./users.json", data)
        res.status(200).send("appended")
    } catch (error) {
        console.error(error);
        res.status(500).send(error)
    }
})

app.put("/users/:id", async (req, res) => {
    try {
        let data = await fs.readFile("./users.json", "utf8")
        data = await JSON.parse(data)
        let flag = false
        for (let i = 0; i < data.length; i++) {
            if (data[i].id == req.params.id) {
                data[i].name = req.body.name
                flag = true
            }
        } if (flag) {
            data = JSON.stringify(data)
            console.log(data);
            await fs.writeFile("./users.json", data)
            res.status(200).send("Update")
        } else {
            throw new Error("not user id in DB");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error)
    }
})


app.delete("/users/:id", async (req, res) => {
    try {
        let data = await fs.readFile("./users.json", "utf8")
        data = await JSON.parse(data)
        const userid = await data.findIndex((user) => {user.id = req.params.id})
    if (userid) {
        await data.splice(userid,1)
        data = JSON.stringify(data)
        console.log(data);
        await fs.writeFile("./users.json", data)
        res.status(200).send("delete")
    } else {
        throw new Error("not user id in DB");
    }
} catch (error) {
    console.error(error);
    res.status(500).send(error)
}
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})