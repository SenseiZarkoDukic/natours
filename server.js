const app = require('./app');

console.log(process.env.NODE_ENV);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
