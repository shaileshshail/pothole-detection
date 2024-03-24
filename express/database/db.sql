
CREATE TABLE USERS(
	`fname` VARCHAR(30),
    `lname` VARCHAR(30),
    `email` VARCHAR(50),
    `password` VARCHAR(100),
    `phoneNo` BIGINT,
    `role` CHAR(2),
    PRIMARY KEY(EMAIL)
);
INSERT INTO USERS VALUES("Shailesh","P","shail@gmail.com","123456",12346657,"AD");

CREATE TABLE POTHOLES(
	`id` INT AUTO_INCREMENT,
    `createdTime` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updatedTime` DATETIME ON UPDATE CURRENT_TIMESTAMP,
    `latitude` DECIMAL(8,6),
    `longitude` DECIMAL(9,6),
    `address` VARCHAR(300),
    `image` VARCHAR(200),
    `masked_image` VARCHAR(200),
    `contractorId` INT,
    `afterImage` VARCHAR(200),
    PRIMARY KEY(ID),
    FOREIGN KEY `contractorId` refernces
)


CREATE TABLE CONTRACTOR(
	`id` INT AUTO_INCREMENT,
    `createdTime` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `name` VARCHAR(100),
    `address` VARCHAR(300),
    `pincode` INT,
    `logo` VARCHAR(200),
    `phoneNo` BIGINT, 
    `altPhoneNo` BIGINT,
    `email` VARCHAR(50),
    `password` VARCHAR(100),
    `jobsCompleted` INT,
    `is_active` BOOLEAN,
    PRIMARY KEY(ID)
)

CREATE TABLE CURRENT_NODES(
    `id` VARCHAR(4),
    `ip` VARCHAR(30),
    `port` INT,
    `lat` BIGINT,
    `long` BIGINT,
    `loc` VARCHAR(30),
    `lastseen` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`)
);
