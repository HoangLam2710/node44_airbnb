CREATE DATABASE node44_airbnb;
USE node44_airbnb;

CREATE TABLE roles(
	roid INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(20)
)

INSERT INTO roles (name) VALUES
('super-admin'),
('admin'),
('user');

CREATE TABLE users(
	uid VARCHAR(36) PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	email VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	phone VARCHAR(20) NOT NULL,
	dob DATETIME,
	gender VARCHAR(10),
	role INT DEFAULT 3,
	refresh_token VARCHAR(255),
	FOREIGN KEY(role) REFERENCES roles(roid) ON DELETE CASCADE
);

-- pass is 123456
INSERT INTO users (uid, name, email, password, phone, dob, gender, role) VALUES
(UUID(), 'super admin', 'super-admin@gmail.com', '$2b$10$RB8Ejy30k5RapOdweERkjuN5CMDG.6mdjFS72pPzxjs.7JIfXDhfu', '0123456789', '2024-01-01 00:00:00', 'male', 1);

CREATE TABLE positions(
	pid VARCHAR(36) PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	provice VARCHAR(255) NOT NULL,
	country VARCHAR(255) NOT NULL,
	images TEXT
	status VARCHAR(10) DEFAULT 'active'
);

CREATE TABLE rooms(
	rid VARCHAR(36) PRIMARY KEY,
	pid VARCHAR(36) NOT NULL,
	name VARCHAR(255) NOT NULL,
	no_customer INT NOT NULL,
	no_bedroom INT NOT NULL,
	no_bed INT NOT NULL,
	no_bathroom INT NOT NULL,
	price INT NOT NULL,
	description TEXT,
	is_washing_machine BOOLEAN DEFAULT FALSE,
	is_iron BOOLEAN DEFAULT FALSE,
	is_television BOOLEAN DEFAULT FALSE,
	is_air_conditioner BOOLEAN DEFAULT FALSE,
	is_wifi BOOLEAN DEFAULT FALSE,
	is_kitchen BOOLEAN DEFAULT FALSE,
	is_parking BOOLEAN DEFAULT FALSE,
	is_pool BOOLEAN DEFAULT FALSE,
	images TEXT,
	status VARCHAR(10) DEFAULT 'active',
	FOREIGN KEY(pid) REFERENCES positions(pid) ON DELETE CASCADE
);

CREATE TABLE reservation(
	reid VARCHAR(36) PRIMARY KEY,
	uid VARCHAR(36) NOT NULL,
	rid VARCHAR(36) NOT NULL,
	checkin_at DATETIME NOT NULL,
	checkout_at DATETIME NOT NULL,
	no_customer INT NOT NULL,
	FOREIGN KEY(uid) REFERENCES users(uid) ON DELETE CASCADE,
	FOREIGN KEY(rid) REFERENCES rooms(rid) ON DELETE CASCADE	
);

CREATE TABLE comments(
	cid VARCHAR(36) PRIMARY KEY,
	uid VARCHAR(36) NOT NULL,
	rid VARCHAR(36) NOT NULL,
	content TEXT NOT NULL,
	rate INT NOT NULL,
	create_at DATETIME NOT NULL,
	FOREIGN KEY(uid) REFERENCES users(uid) ON DELETE CASCADE,
	FOREIGN KEY(rid) REFERENCES rooms(rid) ON DELETE CASCADE
);

CREATE TABLE code_forgot_password(
	coid VARCHAR(36) PRIMARY KEY,
	uid VARCHAR(36) NOT NULL,
	code VARCHAR(6) NOT NULL,
	expire_at DATETIME NOT NULL,
	FOREIGN KEY(uid) REFERENCES users(uid) ON DELETE CASCADE
);

DROP TABLE comments
DROP TABLE reservation
DROP TABLE rooms
DROP TABLE positions
DROP TABLE code_forgot_password
DROP TABLE users