const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
// let mysql = require('mysql');
const app = express();
app.use(express.json())

const sequel = new Sequelize("Evaluation", "root", "Khiladi@786", {
    host: "localhost",
    dialect: "mysql"
});

sequel.authenticate()
    .then(() => {
        console.log("Connected to databases")
    }).catch((err) => {
        console.log("Error while connecting")
    })


// ********USER TABLES**********
const users = sequel.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    address: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: "Confirmed"
    }
});
// ********ORDERS TABLES**********
const orders = sequel.define('Orders', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    address: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    orderitem:{
        type: DataTypes.STRING(30),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: "Confirmed"
    }
});

// ********TIMELINES TABLES**********
const Timelines = sequel.define('Timelines', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    oderid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    message: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: "Not added"
    }
})


// **********ROUTES*************
app.get("/", async (req, res) => {
    await sequel.sync().then(() => {
        res.send("WELCOME")
    })
});

// **********Useradd*************
app.get("/register/users", async (req, res) => {
    let payload = req.body;
    await users.create(payload).then(() => {
        console.log("USER REGISTER SUCCESSFUL")
        res.send("USER REGISTER SUCCESSFUL")
 })
});
// ******ADD ORDER****
app.post("/create/order", async (req, res) => {
    let payload = req.body;
    await orders.create(payload).then(() => {
        console.log("ORDER SUCCESSFUL")
        res.send("ORDER SUCCESSFUL")
 })});

 //*******UPDATE STATUS */
 app.patch("/update/order", async (req, res) => {
    let payload=req.body;
    await orders.update({status:payload.status},{
        where:{
            id:payload.id
        }
    });
  
    await Timelines.create({oderid:payload.id,
      username:payload.username,message:payload.message});
    res.send("Order Updated with Timeline")
});

 //*******Get Order details by user */
 app.get("/getall/order/:user", async (req, res) => {
    let username=req.params.orderid;
    let data =await orders.findAll({username});
    const [results, Evaluation] = await sequel.query(
        "SELECT * FROM Orders JOIN timelines ON Orders.id = timelines.orderid"
      );
      console.log(JSON.stringify(results, null, 2));
    res.send(results)
 });





// *******SERVER*********
app.listen(9168, () => {
    console.log("Server is running 🙌");
})