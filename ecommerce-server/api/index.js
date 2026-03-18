import express from "express";
import Razorpay from "razorpay";
import cors from "cors";
import pkg from "pg";
import { createHmac } from "crypto";

import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const app = express();

app.use(cors());
app.use(express.json());

/* ⭐ Razorpay */
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

/* ⭐ PostgreSQL Connection */
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

/* ⭐ Create Razorpay Order */

app.post("/create-order", async (req, res) => {
    try {

        const { amount } = req.body;

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: "receipt_" + Date.now()
        };

        const order = await razorpay.orders.create(options);

        res.json(order);

    } catch (err) {
        console.log(err);
        res.status(500).send("Order creation failed");
    }
});

/* ⭐ Save Order in PostgreSQL */

app.post("/save-order", async (req, res) => {
    try {

        const { items, total, payment } = req.body;

        await pool.query(
            `insert into orders_angular(total, payment_id, items)
       values($1,$2,$3)`,
            [
                total,
                payment.razorpay_payment_id,
                JSON.stringify(items)
            ]
        );

        res.sendStatus(200);

    } catch (err) {
        console.log(err);
        res.status(500).send("Saving order failed");
    }
});

app.post("/verify-payment", async (req, res) => {
    try {

        const {
            items,
            total,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        /* const expectedSignature = crypto
            .createHmac("sha256", "eUO2oYhFEu7XlbzOopp6UYGL")
            .update(body.toString())
            .digest("hex"); */
        const expectedSignature = createHmac(
            "sha256",
            "eUO2oYhFEu7XlbzOopp6UYGL"
        )
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).send("Invalid payment");
        }

        await pool.query(
            `insert into orders_angular(total, payment_id, items)
       values($1,$2,$3)`,
            [
                total,
                razorpay_payment_id,
                JSON.stringify(items)
            ]
        );

        res.json({
            success: true,
            message: "Payment verified"
        });

    } catch (err) {
        console.log(err);
        res.status(500).send("Verification failed");
    }
});

app.get("/orders", async (req, res) => {
    try {

        const result = await pool.query(
            `select * from orders_angular
       order by created_at desc`
        );

        res.json(result.rows);

    } catch (err) {
        console.log(err);
        res.status(500).send("Fetching orders failed");
    }
});

/* ⭐ Start Server */

/* app.listen(5000, () =>
    console.log("🚀 Server running on port 5000")
); */
//Because Vercel is serverless → no manual listen
export default app;