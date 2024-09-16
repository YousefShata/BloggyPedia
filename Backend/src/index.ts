import express from 'express';
import bodyParser from 'body-parser';
import '../db/mongo';
import router from '../routes/index';
import cors from 'cors';

const PORT = process.env.PORT || 5000;


const app = express();
require('dotenv').config();
app.use(bodyParser.json({ limit: '50mb' }));

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET, POST, PUT,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use('/public', express.static('public'));

app.listen(PORT, () =>  {
    console.log(`Server is starting at port:${PORT}`)
});

app.use('/', router);

export default app;