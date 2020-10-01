const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const password = "Ef4eQDZgFrr6Huu";

const uri =
    "mongodb+srv://organicUser:Ef4eQDZgFrr6Huu@cluster0.cxlgm.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

client.connect((err) => {
    const productCollection = client.db("organicdb").collection("products");
    // const product = { name: "modhu", price: 25, quantity: 20 };

    // Read-- Get

    app.get("/products", (req, res) => {
        productCollection.find({}).toArray((err, documents) => {
            res.send(documents);
        });
    });

    app.get("/product/:id", (req, res) => {
        productCollection
            .find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            });
    });

    // Create --- Post
    app.post("/addProduct", (req, res) => {
        const product = req.body;
        productCollection.insertOne(product).then((result) => {
            console.log("data added successfully");
            res.send("success");
        });
    });

    // to update

    app.patch("/update/:id", (req, res) => {
        console.log(req.body.price);
        productCollection
            .updateOne(
                { _id: ObjectId(req.params.id) },
                {
                    $set: {
                        price: req.body.price,
                        quantity: req.body.quantity,
                    },
                }
            )
            .then((result) => {
                console.log(result);
            });
    });
    // Delete

    app.delete("/delete/:id", (req, res) => {
        productCollection
            .deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                console.log(result);
            });
    });
});

app.listen(3000);
