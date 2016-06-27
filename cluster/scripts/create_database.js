/**
 * Created by david.bernadett on 6/26/16.
 */

var mysql = require('mysql');
var dbconfig = require('../config/database');

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
    `regex` VARCHAR(20) NOT NULL, \
    `category_id` INT UNSIGNED NOT NULL, \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    INDEX `category_id_index` (`category_id` ASC) \
)');

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.reports_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `charge` INT NOT NULL, \
    `description` CHAR(60) NOT NULL, \
    `category_id` INT UNSIGNED NOT NULL, \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    INDEX `category_id_index` (`category_id` ASC) \
)');

console.log('Success: Database Created!')

connection.end();