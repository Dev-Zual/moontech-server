require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0zufct5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("moontech");
    const productCollection = db.collection("product");

    app.get("/blogs", async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    app.get("/blog/:id", async (req, res) => {
      const { id } = req.params;
      const filter = { _id: ObjectId(id) };
      const cursor = await productCollection.findOne(filter);

      res.send({ status: true, data: cursor });
    });

    app.post("/blog", async (req, res) => {
      const product = req.body;
      const cursor = await productCollection.insertOne(product);

      res.send({ status: true, data: cursor });
    });

    app.delete("/blog/:id", async (req, res) => {
      const { id } = req.params;
      const filter = { _id: ObjectId(id) };
      const result = productCollection.deleteOne(filter);
      res.send({ status: true, message: "deleted" });
    });

    app.patch("/blog/:id", async (req, res) => {
      const { id } = req.params;
      const result = await productCollection.updateOne({ _id: id }, req.body);
      res.send({ status: true, message: "updated" });
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
