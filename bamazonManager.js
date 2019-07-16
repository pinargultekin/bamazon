//Requirements
var mysql = require("mysql");
var inquirer = require("inquirer");

//Setting connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    opening();
});


//Opening function with a menu
function opening() {
    inquirer.prompt({
        name: "menu",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "* View Products for Sale",
            "* View Low Inventory",
            "* Add to Inventory",
            "* Add New Product",
            "* Exit"
        ]
    }).then(function (answer) {
        if (answer.menu === "* View Products for Sale") {
            viewProduct();
        } else if (answer.menu === "* View Low Inventory") {
            lowInventory();
        } else if (answer.menu === "* Add to Inventory") {
            addInventory();
        } else if (answer.menu === "* Add New Product") {
            addNew();
        } else {
            connection.end();
        }
    });
}
