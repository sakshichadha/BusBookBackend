const e = require('express');
const connectDB = require('./config/db');

const app = e();
app.use(e.json({ extended: false }));
connectDB();
app.get('/', (req, res) => {
  res.send('API RUNNING');
});
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

const port = 5000;
app.listen(port, () => console.log('Server has started'));
