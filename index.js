const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const password = "Ef4eQDZgFrr6Huu";

const uri =
    "mongodb+srv://organicUser:Ef4eQDZgFrr6Huu@cluster0.cxlgm.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
            // res.send("success");
            res.redirect("/");
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
                res.send(result.modifiedCount > 0);
            });
    });
    // Delete

    app.delete("/delete/:id", (req, res) => {
        productCollection
            .deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
            });
    });
});

app.listen(3000);
