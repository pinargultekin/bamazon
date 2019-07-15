var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    //console.log("Welcome to Bamazon! \nHere is a list of the products: \n" + )
    opening();
});

function opening() {

    console.log("\x1b[32m","\n\n=_=_=_=_=_=_=_=_=_Welcome to Bamazon!=_=_=_=_=_=_=_=_=_")
    console.log("\n\nHere is a list of Bamazon products: \n");
    var query = "select item_id, product_name, price from products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Item id: " + res[i].item_id + " || Item Name: " + res[i].product_name + " || Item Price: " + res[i].price + "\n");
        }
        selectQuery();
    });
}

function selectQuery() {
    inquirer.registerPrompt('number', require('inquirer-number-plus'));

    inquirer.prompt([
        {
            name: "productid",
            type: "number",
            message: "Please enter the ID of the product you would like to buy: "
        },
        {
            name: "quantity",
            type: "number",
            message: "Please enter how many units of product you would like to buy: "
        }
    ]).then(function (input) {
        var item = input.productid;
        var quantity = input.quantity;

        var query = "select * from products where ?";

        connection.query(query, { item_id: item }, function (err, res) {
            if (err) throw err;

            if (res.length === 0) {
                console.log("Invalid ID. Plese enter a valid item ID.");
                opening();
            } else {
                var itemInfo = res[0];

                if (quantity <= itemInfo.stock_quantity) {
                    console.log("Item in stock!");


                        inquirer.prompt({
                            name: "confirm",
                            type: "confirm",
                            message: "Your total is $" + (itemInfo.price * quantity) + ". Would you like to continue?",
                            default: true
                        }).then(function (response) {
                            if (response.confirm) {
                                
                                console.log("Your order is being processed. Thank you for your purchase.");

                                var updateStock = "update products set stock_quantity=" + (itemInfo.stock_quantity - quantity) + " where item_id=" + item;
                                connection.query(updateStock, function (err, res) {
                                    if (err) throw err;
                                });
                                connection.end();
                            }else{
                                console.log("Thank you!");
                                connection.end();
                            }
                        })
                    }
                 else{
                    console.log("\n\nUnsufficient item. There are only "+itemInfo.stock_quantity+ " " + itemInfo.product_name);
                    console.log("Please update unit of the product.");
                    opening();
                }
            }
        })
    })
}