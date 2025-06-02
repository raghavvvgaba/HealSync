require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const port = 3000;

const app = express();
app.use(cors({
    domains: ["http://localhost:5173/"] 
}));
app.use(express.json());

app.use('/api/user', userRoutes);

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(port);
    console.log(`Server is running on http://localhost:${port}`)
}
main();