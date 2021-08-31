const mongoose = require('mongoose');
const { PORT, MONGODB_URI } = require('./utils/config');
const app = require('./app');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app };
