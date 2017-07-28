CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
	item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price INTEGER(10) NOT NULL,
  stock_quanity INTEGER(10) NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quanity)
	VALUES("soap", "bath", 2, 200),
	("carrots", "produce", 1, 300),
	("toothpaste", "bath", 2.5, 400),
	("top ramen", "noodles", 1, 1000),
	("microwave popcorn", "snacks", 4, 300),
	("shaving cream", "bath", 2, 100),
	("potatoes", "produce", 2, 300),
	("onions", "produce", 2, 500),
	("tortilla chips", "snacks", 2, 500),
	("deodorant", "bath", 3, 500);

SELECT * FROM products;