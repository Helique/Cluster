var Mechanics = require("./mechanics");

function updateTransactions(user, bank_id) {
  if (bank_id == 1) {
    Mechanics.updateTransactions(user);
  }
  // else if (bank_id == ..) { }
  else {
    throw new Error("unsupported bank_id " + bank_id);
  }
}

module.exports = {
  updateTransactions: updateTransactions
};
