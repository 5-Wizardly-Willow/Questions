const express = require('express');
const path = require('path');

const router = require('./router.js');

const app = express();
const PORT = 3000;

app.use(express.urlencoded());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Questions Service listening at http://localhost:${PORT}`)
})
