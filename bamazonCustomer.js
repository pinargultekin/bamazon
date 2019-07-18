var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

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

    console.log("\x1b[32m","\n\n          =_=_=_=_=_=_=_=_=_WELCOME TO BAMAZON!_=_=_=_=_=_=_=_=_=_")
    console.log("\n_=_=_=_=_=_=_=_=_=_=_=_=_=_BAMAZON PRODUCT LIST_=_=_=_=_=_=_=_=_=_=_=_=_");

    var itemTable = new Table ({
        head: ["Item ID", "Item Name", "Price"],
        colWidths: [15, 40, 15]
    });
    var query = "select item_id, product_name, price from products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            var itemID= res[i].item_id;
            var itemName = res[i].product_name;
            var itemPrice= res[i].price;
            itemTable.push([itemID, itemName, itemPrice]);
            //console.log("Item id: " + res[i].item_id + " || Item Name: " + res[i].product_name + " || Item Price: " + res[i].price + "\n");
            
        }
        console.log(itemTable.toString());
        selectQuery();
    });
}

function selectQuery() {
    inquirer.registerPrompt('number', require('inquirer-number-plus'));

    inquirer.prompt([
        {
            name: "productid",
            type: "number",
            message: "\nPlease enter the ID of the product you would like to buy: "
        },
        {
            name: "quantity",
            type: "number",
            message: "\nPlease enter how many units of product you would like to buy: "
        }
    ]).then(function (input) {
        var item = input.productid;
        var quantity = input.quantity;

        var query = "select * from products where ?";

        connection.query(query, { item_id: item }, function (err, res) {
            if (err) throw err;

            if (res.length === 0) {
                console.log("\nInvalid ID. Plese enter a valid item ID.");
                connection.end();
            } else {
                var itemInfo = res[0];

                if (quantity <= itemInfo.stock_quantity) {
                    console.log("\x1b[33m","\n\nItem in stock!");


                        inquirer.prompt({
                            name: "confirm",
                            type: "confirm",
                            message: "\n\nYour total is $" + (itemInfo.price * quantity) + ". Would you like to continue?",
                            default: true
                        }).then(function (response) {
                            if (response.confirm) {
                                
                                console.log("\x1b[32m","\n\nYour order is being processed. Thank you for your purchase.");

                                var updateStock = "update products set stock_quantity=" + (itemInfo.stock_quantity - quantity)+", product_sale="+((itemInfo.product_sale + quantity) * itemInfo.price) + " where item_id=" + item;
                                connection.query(updateStock, function (err, res) {
                                    if (err) throw err;
                                });
                                connection.end();
                            }else{
                                console.log("\x1b[36m","Thank you!");
                                connection.end();
                            }
                        })
                    }
                 else{
                    console.log("\x1b[31m" ,"\n\nUnsufficient item. There are only "+itemInfo.stock_quantity+ " " + itemInfo.product_name);
                    console.log("Please update unit of the product.");
                    selectQuery();
                }
            }
        })
    })
}