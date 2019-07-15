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

    console.log("\n\nWelcome to Bamazon! \nHere is a list of Bamazon products: \n");
    var query = "select item_id, product_name, price from products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Item id: " + res[i].item_id + " || Item Name: " + res[i].product_name + " || Item Price: " + res[i].price + "\n");
        }
        selectQuery();
    });
}
