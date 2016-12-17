/**
 * Created by david.bernadett on 6/26/16.
 */

var mysql = require('mysql');
var dbconfig = require('../config/credentials/database');

var connection = mysql.createConnection(dbconfig.connection);

connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.categories_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `category_name` CHAR(60) NOT NULL, \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `category_name_UNIQUE` (`category_name` ASC) \
)');

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.regex_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `regex` VARCHAR(60) NOT NULL, \
    `category_name` CHAR(60) NOT NULL, \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    INDEX `category_name_INDEX` (`category_name` ASC), \
    UNIQUE INDEX `regex_UNIQUE` (`regex` ASC) \
)');

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
)');

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.users_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `email` CHAR(60) NOT NULL, \
    `passhash` CHAR(60) NOT NULL, \
    `name` CHAR(100) NOT NULL, \
    `createdOn` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, \
    PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `name_UNIQUE` (`name`) \
)');

console.log('Success: Database Created!')

connection.end();
