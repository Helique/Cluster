/**
 * Created by david.bernadett on 6/26/16.
 */

var mysql = require('mysql');
var async = require('async');
var dbconfig = require('../config/credentials/database');

var connection = mysql.createConnection(dbconfig.connection);

function createCategories(callback) {
  connection.query('\
  CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.categories_table + '` ( \
      `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
      `category_name` CHAR(60) NOT NULL, \
          PRIMARY KEY (`id`), \
      UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
      UNIQUE INDEX `category_name_UNIQUE` (`category_name` ASC) \
  )', callback);
}

function createRegex(callback) {
  connection.query('\
  CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.regex_table + '` ( \
      `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
      `regex` VARCHAR(60) NOT NULL, \
      `category_name` CHAR(60) NOT NULL, \
          PRIMARY KEY (`id`), \
      UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
      INDEX `category_name_INDEX` (`category_name` ASC), \
      UNIQUE INDEX `regex_UNIQUE` (`regex` ASC) \
  )', callback);
}

function createBanks(callback) {
  connection.query('\
  CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.banks_table + '` ( \
      `id` INT UNSIGNED NOT NULL, \
      PRIMARY KEY (`id`), \
      `name` CHAR(60) NOT NULL, \
      UNIQUE INDEX `name_UNIQUE` (`name`) \
  )', callback);
}

function createBankAccounts(callback) {
  connection.query('\
  CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.accounts_table + '` ( \
      `id` INT UNSIGNED NOT NULL, \
      PRIMARY KEY (`id`), \
      `user_id` INT UNSIGNED NOT NULL, \
      FOREIGN KEY(user_id) REFERENCES ' + dbconfig.database + "." + dbconfig.users_table + '(id), \
      `bank_id` INT UNSIGNED, \
      FOREIGN KEY(bank_id) REFERENCES ' + dbconfig.database + "." + dbconfig.banks_table + '(id), \
      `collection_count` BIGINT UNSIGNED DEFAULT 0 \
  )', callback);
}

function createCharges(callback) {
  connection.query('\
  CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.charges_table + '` ( \
      `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
      `user_id` INT UNSIGNED NOT NULL, \
      `bank_id` BIGINT UNSIGNED NOT NULL, \
      `account_id` BIGINT UNSIGNED NOT NULL, \
      `account_type` CHAR(60) NOT NULL, \
      `description` CHAR(60) NOT NULL, \
      `charge` DOUBLE NOT NULL, \
      `memo` CHAR(60) NOT NULL, \
      `fitid` TEXT NOT NULL, \
      `category_id` INT UNSIGNED NOT NULL, \
      `date` DATE NOT NULL, \
      `acc_balance` DOUBLE NOT NULL, \
      PRIMARY KEY (`id`), \
      UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
      INDEX `category_id_INDEX` (`category_id` ASC), \
      INDEX `date_INDEX` (`date` ASC), \
      UNIQUE INDEX `fitid_UNIQUE` (`fitid`(255), `user_id`, `bank_id`, `account_id`, `account_type` ASC) \
  )', callback);
}

function createUsers(callback) {
  connection.query('\
  CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.users_table + '` ( \
      `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
      `email` CHAR(60) NOT NULL, \
      `passhash` CHAR(60) NOT NULL, \
      `name` CHAR(100) NOT NULL, \
      `createdOn` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, \
      PRIMARY KEY (`id`), \
      UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
      UNIQUE INDEX `name_UNIQUE` (`name`), \
      UNIQUE INDEX `email_UNIQUE` (`email`) \
  )', callback);
}

function createReviews(callback) {
  connection.query('\
  CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.review_table + '` ( \
      `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
      PRIMARY KEY (`id`), \
      `user_id` INT UNSIGNED NOT NULL, \
      FOREIGN KEY(user_id) REFERENCES ' + dbconfig.database + "." + dbconfig.users_table + '(id), \
      `name` CHAR(60), \
      `date_start` DATE,\
      `date_end` DATE,\
      `money_out` DOUBLE,\
      `money_in` DOUBLE, \
      `goal_id` INT UNSIGNED default NULL \
  )', callback);
}

function createGoals(callback) {
  connection.query('\
  CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.goal_table + '` ( \
      `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
      PRIMARY KEY (`id`), \
      `user_id` INT UNSIGNED NOT NULL, \
      FOREIGN KEY(user_id) REFERENCES ' + dbconfig.database + "." + dbconfig.users_table + '(id), \
      `name` CHAR(60), \
      `spd_min` DOUBLE,\
      `spd_max` DOUBLE,\
      `money_max` DOUBLE,\
      `money_min` DOUBLE,\
     `review_id` INT UNSIGNED NOT NULL, \
      FOREIGN KEY (review_id) REFERENCES ' + dbconfig.database + "." + dbconfig.review_table + '(id) \
  )', callback);
}

function addKeys(callback){
  connection.query('\
  ALTER TABLE `' + dbconfig.database + '`.`' + dbconfig.review_table + '` \
     ADD FOREIGN KEY (goal_id) REFERENCES ' + dbconfig.database + "." + dbconfig.goal_table + '(id) \
  ', callback);
}

function createRegexReviewPivot(callback) {
  connection.query('\
  CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.regex_review_pivot_table + '` ( \
      `user_id` INT UNSIGNED NOT NULL, \
      FOREIGN KEY(user_id) REFERENCES ' + dbconfig.database + "." + dbconfig.users_table + '(id), \
      `regex_id` INT UNSIGNED NOT NULL, \
      FOREIGN KEY(regex_id) REFERENCES ' + dbconfig.database + "." + dbconfig.regex_table + '(id), \
      `review_id` INT UNSIGNED, \
      FOREIGN KEY(review_id) REFERENCES ' + dbconfig.database + "." + dbconfig.review_table + '(id), \
      `money_out` DOUBLE,\
      `money_in` DOUBLE,\
      `exclude` TINYINT(1) \
  )', callback);
}

function createCategoryReviewPivot(callback) {
  connection.query('\
  CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.category_review_pivot_table + '` ( \
      `user_id` INT UNSIGNED NOT NULL, \
      FOREIGN KEY(user_id) REFERENCES ' + dbconfig.database + "." + dbconfig.users_table + '(id), \
      `category_id` INT UNSIGNED NOT NULL, \
      FOREIGN KEY(category_id) REFERENCES ' + dbconfig.database + "." + dbconfig.categories_table + '(id), \
      `review_id` INT UNSIGNED, \
      FOREIGN KEY(review_id) REFERENCES ' + dbconfig.database + "." + dbconfig.review_table + '(id), \
      `money_out` DOUBLE,\
      `money_in` DOUBLE,\
      `exclude` TINYINT(1) \
  )', callback);
}

function createChargeReviewPivot(callback) {
  connection.query('\
  CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.charge_review_pivot_table + '` ( \
      `user_id` INT UNSIGNED NOT NULL, \
      FOREIGN KEY(user_id) REFERENCES ' + dbconfig.database + "." + dbconfig.users_table + '(id), \
      `charge_id` INT UNSIGNED NOT NULL, \
      FOREIGN KEY(charge_id) REFERENCES ' + dbconfig.database + "." + dbconfig.charges_table + '(id), \
      `review_id` INT UNSIGNED, \
      FOREIGN KEY(review_id) REFERENCES ' + dbconfig.database + "." + dbconfig.review_table + '(id), \
      `subtransaction` INT UNSIGNED DEFAULT 0, \
      `override` TINYINT(1), \
      `exclude` TINYINT(1) \
  )', callback);
}


function setupBanks(callback) {
  var banks = Object.keys(dbconfig.banks);
  var functions = banks.map(function(bank) {
    return function(callback) {
      bank_data = dbconfig.banks[bank];
      connection.query(`INSERT INTO ` + dbconfig.database + '.' + dbconfig.banks_table +
        ` (id, name) VALUES (?, ?)`, [bank_data.id, bank_data.name], callback);
    }
  });

  async.parallel(functions, function(err, results) {
    connection.end();
    callback(err, results);
  });
}

module.exports = function(callback) {
  var functions = [createCategories, createUsers, createRegex, createBanks, createBankAccounts,
    createCharges, createReviews, createGoals, addKeys, createRegexReviewPivot, createCategoryReviewPivot, createChargeReviewPivot, setupBanks];

  // series because some functions need to finish before others can start
  // due to foreign keys
  async.series(functions, callback);
};
