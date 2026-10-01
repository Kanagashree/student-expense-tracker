import { useState, useEffect } from "react";
import "./Home.css";

function Home({ email, logout }) {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [expenses, setExpenses] = useState([]);
    const [editId, setEditId] = useState(null);

    const getExpenses = async () => {
        const response = await fetch(
            `http://localhost:8000/expenses/${email}`
        );

        const data = await response.json();

        setExpenses(data);
    };

    useEffect(() => {
        getExpenses();
    }, []);

    const addExpense = async () => {
        if (
            name === "" ||
            amount === "" ||
            category === "" ||
            date === ""
        ) {
            alert("Please enter all details");
            return;
        }

        const response = await fetch("http://localhost:8000/expense", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                name: name,
                amount: Number(amount),
                category: category,
                date: date
            })
        });

        const data = await response.json();

        alert(data.message);

        setName("");
        setAmount("");
        setCategory("");
        setDate(new Date().toISOString().split("T")[0]);

        getExpenses();
    };

    const deleteExpense = async (id) => {
        const response = await fetch(
            `http://localhost:8000/expense/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        alert(data.message);

        getExpenses();
    };

    const editExpense = (expense) => {
        setEditId(expense._id);
        setName(expense.name);
        setAmount(expense.amount);
        setCategory(expense.category);
        setDate(expense.date || new Date().toISOString().split("T")[0]);
    };

    const updateExpense = async () => {
        if (
            name === "" ||
            amount === "" ||
            category === "" ||
            date === ""
        ) {
            alert("Please enter all details");
            return;
        }

        const response = await fetch(
            `http://localhost:8000/expense/${editId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    amount: Number(amount),
                    category: category,
                    date: date
                })
            }
        );

        const data = await response.json();

        alert(data.message);

        setName("");
        setAmount("");
        setCategory("");
        setDate(new Date().toISOString().split("T")[0]);
        setEditId(null);

        getExpenses();
    };

    const totalExpense = expenses.reduce((total, expense) => {
        return total + (Number(expense.amount) || 0);
    }, 0);

    const expenseCount = expenses.length;

    const averageExpense =
        expenseCount === 0 ? 0 : totalExpense / expenseCount;

    const categories = {};

    expenses.forEach((expense) => {
        if (categories[expense.category]) {
            categories[expense.category] += Number(expense.amount) || 0;
        } else {
            categories[expense.category] =
                Number(expense.amount) || 0;
        }
    });

    return (
        <div className="home-container">

            <div className="header">
                <div>
                    <h1>Student Expense Tracker</h1>
                    <p>Welcome, {email}</p>
                </div>

                <button onClick={logout}>Logout</button>
            </div>

            <div className="dashboard">

                <div className="total-card">
                    <p>Total Expense</p>

                    <h2>₹{totalExpense}</h2>

                    <p>Number of Expenses: {expenseCount}</p>

                    <p>
                        Average Expense: ₹{averageExpense.toFixed(2)}
                    </p>
                </div>

                <div className="form-card">

                    <h2>
                        {editId ? "Edit Expense" : "Add Expense"}
                    </h2>

                    <input
                        type="text"
                        placeholder="Expense name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />

                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />

                    {editId ? (
                        <button onClick={updateExpense}>
                            Update Expense
                        </button>
                    ) : (
                        <button onClick={addExpense}>
                            Add Expense
                        </button>
                    )}

                </div>

                <div className="expense-card">

                    <h2>Category Wise Expenses</h2>

                    {Object.keys(categories).length === 0 ? (
                        <p>No expenses added yet.</p>
                    ) : (
                        Object.keys(categories).map((category) => (
                            <p key={category}>
                                {category}: ₹{categories[category]}
                            </p>
                        ))
                    )}

                </div>

                <div className="expense-card">

                    <h2>My Expenses</h2>

                    {expenses.length === 0 ? (
                        <p>No expenses added yet.</p>
                    ) : (
                        expenses.map((expense) => (
                            <div
                                className="expense-item"
                                key={expense._id}
                            >

                                <div>
                                    <strong>{expense.name}</strong>

                                    <p>{expense.category}</p>

                                    <p>{expense.date}</p>
                                </div>

                                <div>
                                    <strong>
                                        ₹{expense.amount}
                                    </strong>

                                    <button
                                        onClick={() =>
                                            editExpense(expense)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            deleteExpense(expense._id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>

                            </div>
                        ))
                    )}

                </div>

            </div>

        </div>
    );
}

export default Home;