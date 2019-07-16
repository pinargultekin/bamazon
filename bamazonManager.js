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

// View product function
function viewProduct() {
    console.log("\x1b[35m", "\n\n=_=_=_=_=_=_=_=_=_Products for Sale=_=_=_=_=_=_=_=_=_\n\n");
    var query = "select * from products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {

            console.log("Item id: " + res[i].item_id + " || Item Name: " + res[i].product_name + " || Item Price: " + res[i].price + " || Quantity: " + res[i].stock_quantity + "\n");

        }
        opening();
    });
}

// Low inventory function
function lowInventory() {
    console.log("\x1b[33m", "\n\n=_=_=_=_=_=_=_=_=_Low Inventory=_=_=_=_=_=_=_=_=_\n\n");
    var query = "select * from products where stock_quantity<5";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var j = 0; j < res.length; j++) {
            console.log("Item id: " + res[j].item_id + " || Item Name: " + res[j].product_name + " || Item Price: " + res[j].price + " || Quantity: " + res[j].stock_quantity + "\n");
        }
        opening();
    });
}

