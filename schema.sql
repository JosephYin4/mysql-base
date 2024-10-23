
-- SQL Schema for HomeRentCare
CREATE DATABASE homerentcare;

USE homerentcare;

CREATE TABLE User_Details
(
 userID        INT UNSIGNED NOT NULL AUTO_INCREMENT,
 typeofUser    varchar(15) NOT NULL ,
 fullName      varchar(45) NOT NULL ,
 contactNumber varchar(15) NOT NULL ,
 email        varchar(45) NOT NULL ,

PRIMARY KEY (userID)
);

CREATE TABLE Property_Details (
    propertyID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nameofProperty VARCHAR(45) NOT NULL,
    address VARCHAR(150) NOT NULL,
    postalCode VARCHAR(10) NOT NULL,
    numberofBedrooms TINYINT UNSIGNED NULL,
    numberofBathrooms TINYINT UNSIGNED NULL,
    carparkLots TINYINT UNSIGNED NULL,
    amenities TEXT NULL,
    askingBaseRent INT NULL,

    PRIMARY KEY (propertyID)
);

CREATE TABLE Tenancy_Details (
    tenancyID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    dateStarted DATE NOT NULL,
    durationofTenancy INT NOT NULL,
    baserentalAmount DECIMAL(10, 2) NOT NULL,
    depositAmount DECIMAL(10, 2) NOT NULL,
    subtenantsFullName VARCHAR(150) NOT NULL,
    propertyID INT UNSIGNED NOT NULL,
    userID INT UNSIGNED NOT NULL,

    PRIMARY KEY (tenancyID),
    KEY FK_Property (propertyID),
    CONSTRAINT FK_Property FOREIGN KEY (propertyID) REFERENCES Property_Details (propertyID),
    KEY FK_User (userID),
    CONSTRAINT FK_User FOREIGN KEY (userID) REFERENCES User_Details (userID)
);