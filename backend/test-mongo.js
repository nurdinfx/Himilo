const mongoose = require('mongoose');
const uri = 'mongodb+srv://cismaankayse377_db_user:kKLvuvHryi6vaB0D@himilohotel.x52lvrg.mongodb.net/himilo-hotel?retryWrites=true&w=majority';

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000, family: 4 })
  .then(() => {
    console.log("SUCCESS! Connected to Atlas.");
    process.exit(0);
  })
  .catch(err => {
    console.error("FAILED TO CONNECT:");
    console.error(err);
    process.exit(1);
  });
