const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/studentexpense")
.then(() => {
    console.log("MongoDB Connected");
})
.catch((error) => {
    console.log(error);
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const expenseSchema = new mongoose.Schema({
    email: String,
    name: String,
    amount: Number,
    category: String,
    date: String
});

const User = mongoose.model("User", userSchema);
const Expense = mongoose.model("Expense", expenseSchema);

app.get("/", (req, res) => {
    res.send("Student Expense Tracker");
});

app.post("/register", async (req, res) => {
    const user = new User(req.body);
    await user.save();

    res.json({
        message: "User registered"
    });
});

app.post("/login", async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password
    });

    if (user) {
        res.json({
            message: "Login successful"
        });
    } else {
        res.json({
            message: "Invalid email or password"
        });
    }
});

app.post("/expense", async (req, res) => {
    const expense = new Expense({
        email: req.body.email,
        name: req.body.name,
        amount: req.body.amount,
        category: req.body.category,
        date: req.body.date
    });

    await expense.save();

    res.json({
        message: "Expense added"
    });
});

app.get("/expenses/:email", async (req, res) => {
    const expenses = await Expense.find({
        email: req.params.email
    });

    res.json(expenses);
});

app.delete("/expense/:id", async (req, res) => {
    await Expense.findByIdAndDelete(req.params.id);

    res.json({
        message: "Expense deleted"
    });
});

app.put("/expense/:id", async (req, res) => {
    await Expense.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        amount: req.body.amount,
        category: req.body.category,
        date: req.body.date
    });

    res.json({
        message: "Expense updated"
    });
});
app.listen(8000, () => {
    console.log("Server running on port 8000");
});