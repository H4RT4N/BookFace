// database
require('./db')

// app setup
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(express.json());
app.use(cors());

// router setup
const userRouter = require('./routes/user.route');
const postRouter = require('./routes/post.route');
app.use('/user', userRouter);
app.use('/post', postRouter);

// backend display
app.get('/', (req, res) => {
    res.send('BookFace Backend');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
