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

//shows products
function showProducts(amt, id){
	//creates a new cli table
	var table = new Table({ head: ["ID", "Name", "Department Name", "Price",] });
	connection.query("SELECT * FROM products", (err, res) =>{
		if(err) throw err;
		res.forEach((element) =>{
			table.push(
				[element.item_id, element.product_name, element.department_name, element.price,]);
			//if the id the user chooses when this function is called later is equal to the id of the product
			if(element.item_id == id){
				var totalPrice = amt * element.price;
				console.log('You just bought ' + amt + ' ' + element.product_name + ' for ' + totalPrice + ' dollars.');
			}
		});
		console.log(table.toString());
		init();
		// connection.end();
	});
}

//initial prompt questions when program is first run
var initQuestions = [{
	type: 'input',
	name: 'chosenID',
	message: 'Type in the ID of the item you want to purchase'
	},
	{
	type: 'input',
	name: 'chosenQuanity',
	message: 'Choose the quanity of the item you want to purchase'
	}];


function init(){
	inquirer.prompt(initQuestions).then(function(answers){
		connection.query("SELECT * FROM products WHERE ?", {item_id: answers.chosenID}, (err, res) => {
			if(err) throw err;
			updateStock(res, answers);
		});
	});
}

function updateStock(res, answers){
	var updatedStockQuanity = res[0].stock_quanity - answers.chosenQuanity;
	if (updatedStockQuanity <= 0){
		console.log('Insufficient Quanity!');
		init();
	} else {
		connection.query("UPDATE products SET ? WHERE ?", 
			[{stock_quanity: updatedStockQuanity}, {item_id: answers.chosenID}],
			(err, res) => {
				if(err) throw err;
				var chosenQuanityAmt = answers.chosenQuanity;
				var chosenProductID = answers.chosenID;
				showProducts(chosenQuanityAmt, chosenProductID);
			});
	}
}

showProducts();

