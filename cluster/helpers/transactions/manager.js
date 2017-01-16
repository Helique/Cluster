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

function onVerification(user, code, bank_id, callback) {
  if (bank_id == 1) {
    Mechanics.onVerification(user, code, callback);
  }
  // else if (bank_id == ..) { }
  else {
    throw new Error("unsupported bank_id " + bank_id);
  }
}

module.exports = {
  updateTransactions: updateTransactions,
  onVerification: onVerification
};
