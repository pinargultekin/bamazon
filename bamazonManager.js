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

// Add to inventory function
function addInventory() {
    inquirer.registerPrompt('number', require('inquirer-number-plus'));
    inquirer.prompt(
        {
            name: "productID",
            type: "number",
            message: "Please enter a valid item ID to update the inventory."
        })
        .then(function (input) {
            var item = input.productID;
            var query = "select * from products where ?";

            connection.query(query, { item_id: item }, function (err, res) {
                if (err) throw err;
                if (res.length === 0) {
                    console.log("\nInvalid ID. Plese enter a valid item ID.");
                    addInventory();
                } else {
                    console.log("Item id: " + res[0].item_id + " || Item Name: " + res[0].product_name + " || Item Price: " + res[0].price + " || Quantity: " + res[0].stock_quantity + "\n");
                    inquirer.prompt({

                        name: "quantity",
                        type: "number",
                        message: "How many item would you like to add?"
                    })
                        .then(function (answer) {
                            var quantity = answer.quantity;
                            var updateQuery = "update products set stock_quantity=" + (res[0].stock_quantity + quantity) + " where item_id=" + item;

                            connection.query(updateQuery, function (err, res) {
                                if (err) throw err;
                                console.log("\nInventory updated! " + quantity + " item added.\n\n");
                                viewProduct();
                            });
                        })
                }
            });

        });
}

//Add new product function

function addNew () {
    inquirer.registerPrompt('number', require('inquirer-number-plus'));
    inquirer.prompt([
        {
            name:"productName",
            type: "input",
            message:"Enter the new product name."
        },
        {
            name: "department",
            type: "input",
            message: "Enter the related department name."
        },
        {
            name: "price",
            type: "number",
            message: "Enter the price of the item."
        },
        {
            name: "quantity",
            type: "number",
            message: "Enter the amount of item."
        }
    ])
    .then(function(input){
        connection.query("insert into products set ?",
        {
            product_name: input.productName,
            department_name: input.department,
            price: input.price,
            stock_quantity: input.quantity
        }, function(err){
            if(err) throw err;
            console.log("\nNew product is added to the inventory.\n\n");
            viewProduct();
        });
    });
}