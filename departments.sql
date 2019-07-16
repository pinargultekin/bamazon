drop database if exists departments;
create database departments;

use departments;

create table departments(
    department_id int not null auto_increment,
    department_name VARCHAR(100),
    over_head_cost int(1000),
    PRIMARY key(department_id)
);
