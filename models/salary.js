const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SalarySchema = new Schema({

    class: { type: 'String' },
    month_year: { type: 'String' },
    status: { type: 'String' }

});

module.exports = mongoose.model('salary', SalarySchema);
