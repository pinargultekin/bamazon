var mysql= require("mysql");
var inquirer= require("inquirer");

var connection= mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password:"",
    database: "departments"
});

connection.connect(function(err){
    if(err) throw err;
    opening();
});

function opening(){
    inquirer.prompt([
        {
            name:"menu",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "* View Product Sales by Depratment",
                "* Create New Department",
                "* Exit"
            ]
        }
    ]).then(function (answer) {
        if (answer.menu === "* View Product Sales by Depratment"){
            sales();
        }else if (answer.menu === "* Create New Department"){
            nerDepartment();
        }else{
            connection.end();
        }
    });
}

