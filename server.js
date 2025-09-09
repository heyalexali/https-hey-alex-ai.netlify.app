const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// ✅ Express app
const app = express();
const port = process.env.PORT || 3000;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Connection
const mongoURI = process.env.MONGODB_URI || "mongodb+srv://alexshk07_db_user:<db_password>@alex.u2cgwam.mongodb.net/?retryWrites=true&w=majority&appName=Alex";

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));

// ✅ Schema & Model
const MessageSchema = new mongoose.Schema({
    sender: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", MessageSchema);

// ✅ API: Chat message
app.post('/api/message', async (req, res) => {
    try {
        const message = req.body.message || '';

        // Save user message
        const userMsg = new Message({ sender: "User", text: message });
        await userMsg.save();

        // Bot reply
        let reply;
        if (message.toLowerCase() === 'hey alex') {
            reply = "Amin Sir, kya kaam hai? 🤖";
        } else {
            reply = `Aapne bola: "${message}"`;
        }

        // Save bot reply
        const botMsg = new Message({ sender: "Alex", text: reply });
        await botMsg.save();

        res.json({ reply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ reply: "⚠️ Server error" });
    }
});

// ✅ API: Get chat history
app.get('/api/history', async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: "⚠️ Could not fetch history" });
    }
});

// ✅ Root route
app.get('/', (req, res) => {
    res.send('Hey Alex backend with MongoDB is running!');
});

// ✅ Start server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
