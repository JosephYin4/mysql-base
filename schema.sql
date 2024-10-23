
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

CREATE TABLE Payments (
    paymentID INT AUTO_INCREMENT PRIMARY KEY,
    typeofPayment ENUM('deposit', 'monthlyrental', 'electricbill', 'waterandgasbill', 'repairs', 'replacements', 'new purchase', 'returnofdeposit', 'other') NOT NULL,
    datepaid DATETIME NOT NULL,
    receiverName VARCHAR(255) NOT NULL,
    paymentInvoiceNumber VARCHAR(255) NOT NULL,
    remarks TEXT,
    userID INT UNSIGNED NOT NULL,
    tenancyID INT UNSIGNED NOT NULL,
    KEY FK_User1 (userID),
    CONSTRAINT FK_User1 FOREIGN KEY (userID) REFERENCES User_Details (userID),
    KEY FK_Tenancy (tenancyID),
    CONSTRAINT FK_Tenancy FOREIGN KEY (tenancyID) REFERENCES Tenancy_Details (userID)
);

CREATE TABLE Issues (
    issueID INT AUTO_INCREMENT PRIMARY KEY,
    typeofIssue ENUM('Aircon', 'Heater', 'Lights', 'Plumbing', 'Electrical', 'Other') NOT NULL,
    locationofIssue ENUM('Kitchen', 'Toilet', 'Living Room', 'MasterBedroom', 'Bedroom', 'Other') NOT NULL,
    issuedescriptionDetails TEXT NOT NULL,
    dateOpen DATETIME NOT NULL,
    dateClosed DATETIME,
    issuestatusRemarks TEXT,
    issuecurrentStatus ENUM('open', 'solved', 'wip', 'unresolved') NOT NULL,
    issueSubmittedByID INT UNSIGNED NOT NULL,
    issueResolvedByID INT UNSIGNED NOT NULL,
    KEY FK_IssueSubmittedBy (issueSubmittedByID),
    CONSTRAINT FK_IssueSubmittedBy FOREIGN KEY (issueSubmittedByID) REFERENCES User_Details (userID),
    KEY FK_IssueResolvedBy (issueResolvedByID),
    CONSTRAINT FK_IssueResolvedBy FOREIGN KEY (issueResolvedByID) REFERENCES User_Details (userID)
);

INSERT INTO Issues (typeofIssue, locationofIssue, issuedescriptionDetails, dateOpen, dateClosed, issuestatusRemarks, issuecurrentStatus, issueSubmittedByID, issueResolvedByID) VALUES
('Aircon', 'Living Room', 'Air conditioning unit is not cooling properly.', '2024-01-10 09:00:00', NULL, 'Pending technician visit.', 'open', 1, NULL),
('Heater', 'MasterBedroom', 'Heater is making a loud noise.', '2024-01-12 10:30:00', NULL, 'Waiting for parts to arrive.', 'wip', 2, NULL),
('Lights', 'Kitchen', 'Light bulb is flickering and needs replacement.', '2024-01-15 12:00:00', NULL, 'Scheduled for replacement.', 'open', 1, 3),
('Plumbing', 'Bathroom', 'Toilet is leaking water.', '2024-01-20 14:00:00', '2024-01-21 16:00:00', 'Leak fixed by the plumber.', 'solved', 2, 3),
('Electrical', 'Bedroom', 'Wall socket is not working.', '2024-01-25 09:30:00', NULL, 'Electrician scheduled to check.', 'wip', 1, NULL),
('Aircon', 'MasterBedroom', 'Aircon remote not functioning.', '2024-01-30 11:00:00', NULL, 'Replacement remote ordered.', 'unresolved', 2, NULL),
('Lights', 'Living Room', 'Ceiling light is broken and needs to be replaced.', '2024-02-01 13:00:00', NULL, 'Pending order for replacement light.', 'open', 1, NULL),
('Plumbing', 'Kitchen', 'Sink is draining slowly.', '2024-02-05 15:00:00', NULL, 'Waiting for plumber to arrive.', 'wip', 2, NULL),
('Electrical', 'Toilet', 'Flickering light in the toilet.', '2024-02-10 08:45:00', '2024-02-12 09:15:00', 'Issue resolved by electrician.', 'solved', 1, 3),
('Other', 'Bedroom', 'Miscellaneous issue with the closet door.', '2024-02-15 14:00:00', NULL, 'Pending assessment.', 'open', 2, NULL);

