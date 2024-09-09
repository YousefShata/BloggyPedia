import express from 'express';
import bodyParser from 'body-parser';
import '../db/mongo';
import router from '../routes/index';
import cors from 'cors';

const PORT = process.env.PORT || 5000;


const app = express();
require('dotenv').config();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.listen(PORT, () =>  {
    console.log(`Server is starting at port:${PORT}`)
});

app.use('/', router);

export default app;