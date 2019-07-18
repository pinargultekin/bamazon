drop database if exists bamazon;
create database bamazon;

use bamazon;

create table products (
item_id int not null auto_increment,
product_name varchar(100),
department_name varchar(100),
price decimal (10,2) null,
stock_quantity int null,
primary key (item_id)
);

create table departments(
    department_id int not null auto_increment,
    department_name VARCHAR(100),
    over_head_cost int(10),
    PRIMARY key(department_id)
);

alter table products
add column product_sale int(10) not null after stock_quantity;

insert into products(product_name, department_name, price, stock_quantity)
values ("Air Circulator Fan", "Home Appliances", 49.98, 1);

insert into products(product_name, department_name, price, stock_quantity)
values ("Water Bottle", "Home Appliances", 24.95, 10);

insert into products(product_name, department_name, price, stock_quantity)
values ("Sunglasses", "Accessories", 79.00, 3);

insert into products(product_name, department_name, price, stock_quantity)
values ("Socks", "Clothes", 9.99, 50);

insert into products(product_name, department_name, price, stock_quantity)
values ("Uno Card Game", "Game", 5.50, 20);

insert into products(product_name, department_name, price, stock_quantity)
values ("AAA Batteries", "Households", 10.00, 30);

insert into products(product_name, department_name, price, stock_quantity)
values ("Alarm Clock", "Electronics", 19.98, 5);

insert into products(product_name, department_name, price, stock_quantity)
values ("Cat Food", "Pet Supplies", 39.98, 4);

insert into products(product_name, department_name, price, stock_quantity)
values ("Dog Waste Bag", "Pet Supplies", 14.30, 50);

insert into products(product_name, department_name, price, stock_quantity)
values ("Novel: Fight Club", "Book", 24.65, 10);

select * from products;

select departments.department_id, departments.department_name, departments.over_head_cost, products.product_sale, (sum(products.product_sale)-departments.over_head_cost) 
as total_profit
from departments
inner join products 
on departments.department_name = products.department_name
group by departments.department_id;