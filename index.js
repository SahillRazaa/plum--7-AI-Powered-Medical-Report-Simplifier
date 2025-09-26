const express = require('express');
const dotenv = require('dotenv');
const reportRoutes = require('./api/routes/reportRoutes');
const cors = require('cors'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.send({
        status: "ok",
        message: "Server is healthy :)"
    })
});

app.use('/api/v1', reportRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});