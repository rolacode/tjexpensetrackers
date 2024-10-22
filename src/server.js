const app = require('./app');

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});  