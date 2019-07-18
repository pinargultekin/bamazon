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
    opening();
});

function opening() {
    inquirer.prompt([
        {
            name: "menu",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "* View Product Sales by Depratment",
                "* Create New Department",
                "* Exit"
            ]
        }
    ]).then(function (answer) {
        if (answer.menu === "* View Product Sales by Depratment") {
            sales();
        } else if (answer.menu === "* Create New Department") {
            newDepartment();
        } else {
            connection.end();
        }
    });
}

function sales() {
    console.log("\x1b[33m", "\n\n_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_PRODUCT SALES BY DEPARTMENT_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_");
    var departmentTable = new Table({
        head: ["Department ID", "Department Name", "Overhead Cost", "Total Sales", "Total Profit"],
        colWidths: [15, 40, 15, 15, 15]
    });
    var query = "select departments.department_id, departments.department_name, departments.over_head_cost, products.product_sale, (sum(products.product_sale)-departments.over_head_cost)" +
        " as total_profit " +
        " from departments " +
        " inner join products " +
        " on departments.department_name = products.department_name " +
        " group by department_id";

    connection.query(query, function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            var depID = res[i].department_id;
            var depName = res[i].department_name;
            var cost = res[i].over_head_cost;
            var sales = res[i].product_sale;
            var profit = res[i].total_profit;
            departmentTable.push([depID, depName, cost, sales, profit]);
            //console.log("Department ID: " + res[i].department_id + " || Department Name: "+ res[i].department_name+ " || Overhead Cost: ")
        }
        console.log(departmentTable.toString());
        opening();
    })
}

