/*

Create a new Node application called bamazonManager.js. Running this application will:
List a set of menu options:
View Products for Sale
View Low Inventory
Add to Inventory
Add New Product
If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.


*/

var existingStock = 0;
var updatedStock = 0;

var mysql = require('mysql');
var Table = require('cli-table');
var inquirer = require('inquirer');

//connecting to sql database
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'bamazon'
});

var initManagerQuestions = [{
	type: 'list',
	name: 'initQuestionChoice',
	message: 'Choose what you would like to do',
	choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
}

];

//Manager view function
function showProducts(){
	//creates a new cli table
	var table = new Table({ head: ["ID", "Name", "Department Name", "Price", "Stock"] });
	connection.query("SELECT * FROM products", (err, res) =>{
		if(err) throw err;
		res.forEach((element) =>{
			table.push(
				[element.item_id, element.product_name, element.department_name, element.price, element.stock_quanity]);
			//if the id the user chooses when this function is called later is equal to the id of the product
		});
		console.log(table.toString());
		start();
	});
}

//Shows inventory less than 5
function viewLowInventory(){
	//creates a new cli table
	var table = new Table({ head: ["ID", "Name", "Department Name", "Price", "Stock"] });
	connection.query("SELECT * FROM products", (err, res) =>{
		if(err) throw err;
		res.forEach((element) =>{
			if(element.stock_quanity < 5){
				table.push(
					[element.item_id, element.product_name, element.department_name, element.price, element.stock_quanity]);
				//if the id the user chooses when this function is called later is equal to the id of the product
			}
		});
		console.log(table.toString());
		start();
	});
}

var addToInventoryQuestions = [
{
	type: 'input',
	name: 'chosenID',
	message: 'Choose the ID of the item you want to add'
},
{
	type: 'input',
	name: 'chosenQuanity',
	message: 'Choose the quanity of the item you want to add'
}];

function addToInventory(){


	inquirer.prompt(addToInventoryQuestions).then(function(answers){
		connection.query("SELECT stock_quanity FROM products WHERE ?", {item_id: answers.chosenID}, (err, res) => {
			existingStock = res[0].stock_quanity;
			connection.query("UPDATE products SET ? WHERE ?", 
				[{stock_quanity: (parseInt(existingStock) + parseInt(answers.chosenQuanity))},
				{item_id: answers.chosenID}], (err, res) =>{
					if(err) throw err;
					console.log(res);
				});
			showProducts();

		});
		

	});
}

function addNewProduct(){
	var newProductQuestions = [
	{
		type: 'input',
		name: 'newProductName',
		message: 'What is the name of the product'
	},
	{
		type: 'input',
		name: 'newProductDepartment',
		message: 'What department will the new item be located in?'
	},
	{
		type: 'input',
		name: 'newProductPrice',
		message: 'What is the price of the product'
	},
	{
		type: 'input',
		name: 'newProductStock',
		message: 'How much of the new item will you be adding?'
	}
	];

	inquirer.prompt(newProductQuestions).then(function(answers){
		connection.query ("INSERT INTO products (product_name, department_name, price, stock_quanity) VALUES (?,?,?,?)",
			[answers.newProductName, answers.newProductDepartment, answers.newProductPrice, answers.newProductStock], (err, res) =>{
				if(err) throw err;
			});
		showProducts();
	});
}
function start(){
	inquirer.prompt(initManagerQuestions).then(function(answers){
		if (answers.initQuestionChoice === 'View Products for Sale'){
			showProducts();
		} else if (answers.initQuestionChoice === 'View Low Inventory'){
			viewLowInventory();
		} else if (answers.initQuestionChoice === 'Add to Inventory'){
			addToInventory();
		} else if (answers.initQuestionChoice === 'Add New Product'){
			addNewProduct();
		}
	});
}

start();