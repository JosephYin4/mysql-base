
USE homerentcare;

INSERT INTO User_Details (typeofUser, fullName, contactNumber, email) VALUES
('homeowner', 'Alice Johnson', '123-456-7890', 'alice.johnson@example.com'),
('homeowner', 'Bob Smith', '234-567-8901', 'bob.smith@example.com'),
('maintenant', 'Charlie Brown', '345-678-9012', 'charlie.brown@example.com'),
('maintenant', 'Diana Prince', '456-789-0123', 'diana.prince@example.com'),
('staff', 'Ethan Hunt', '567-890-1234', 'ethan.hunt@example.com'),
('staff', 'Fiona Glenanne', '678-901-2345', 'fiona.glenanne@example.com'),
('agent', 'George Lucas', '789-012-3456', 'george.lucas@example.com'),
('agent', 'Hannah Montana', '890-123-4567', 'hannah.montana@example.com'),
('homeowner', 'Ivy League', '901-234-5678', 'ivy.league@example.com'),
('staff', 'Jack Sparrow', '012-345-6789', 'jack.sparrow@example.com');


INSERT INTO Property_Details (nameofProperty, address, postalCode, numberofBedrooms, numberofBathrooms, carparkLots, amenities, askingBaseRent) VALUES
('Sunshine Villa', '123 Jalan Skudai, Johor Bahru', '81200', 4, 3, 2, 'Pool, Gym', 3000),
('Green Haven', '456 Jalan Taman Perling, Johor Bahru', '81200', 3, 2, 1, 'Garden, Playground', 2500),
('City View Apartment', '789 Jalan Sutera, Johor Bahru', '81300', 2, 2, 1, 'Gym, 24/7 Security', 2000),
('Serenity Home', '101 Jalan Tebrau, Johor Bahru', '80300', 5, 4, 3, 'Pool, BBQ Area', 5000),
('Cozy Corner', '202 Jalan Dato Abdullah Tahir, Johor Bahru', '80300', 2, 1, 1, 'Close to MRT', 2300),
('Tropical Retreat', '303 Jalan Sg. Abong, Johor Bahru', '81200', 4, 3, 2, 'Garden, Wi-Fi', 3100),
('Family Residence', '404 Jalan Maju, Johor Bahru', '80300', 3, 2, 2, 'Playground, Gym', 2600),
('Urban Oasis', '505 Jalan Larkin, Johor Bahru', '80300', 2, 2, 1, 'Swimming Pool, Parking', 2100),
('Luxury Condo', '606 Jalan Adda, Johor Bahru', '81100', 3, 2, 1, 'Gym, Security', 2400),
('Elegant Suites', '707 Jalan Taman Molek, Johor Bahru', '81100', 1, 1, 1, 'Close to shopping mall', 2000);


INSERT INTO Tenancy_Details (dateStarted, durationofTenancy, baserentalAmount, depositAmount, subtenantsFullName, propertyID, userID) VALUES
('2023-01-15', 12, 1500.00, 3000.00, 'Alice Wong, John Tan', 1, 1),
('2023-02-20', 24, 2000.00, 4000.00, 'Michael Tan, Sarah Lee', 2, 2),
('2023-03-05', 6, 1200.00, 2400.00, 'Siti Rahman, Omar Ali', 3, 3),
('2023-04-10', 18, 2500.00, 5000.00, 'John Doe, Jane Smith', 4, 4),
('2023-05-12', 12, 1800.00, 3600.00, 'Fatima Ali, Rina Hassan', 5, 5),
('2023-06-01', 36, 2200.00, 4400.00, 'Rajesh Kumar, Nisha Patel', 6, 6),
('2023-07-15', 12, 1600.00, 3200.00, 'Emma Johnson, Chris Lim', 7, 7),
('2023-08-20', 24, 2100.00, 4200.00, 'David Lim, Hannah Lee', 8, 8),
('2023-09-10', 30, 1900.00, 3800.00, 'Zara Khan, Ali Rizwan', 9, 9),
('2023-10-05', 6, 1300.00, 2600.00, 'Maya Chen, Anil Singh', 10, 10);


INSERT INTO Payments (typeofPayment, datePaid, amountPaid, receiverName, paymentInvoiceNumber, remarks, userID, tenancyID) VALUES
('deposit', '2024-01-15', 4000, 'John Doe', 'INV-1001', 'Initial deposit for tenancy', 1, 1),
('monthlyrental', '2024-02-15', 2000, 'Jane Smith', 'INV-1002', 'February rent payment', 2, 1),
('electricbill', '2024-03-01', 200, 'Utility Company', 'INV-1003', 'Electricity bill for March', 1, 1),
('waterandgasbill', '2024-03-05', 150, 'Utility Company', 'INV-1004', 'Water and gas bill for March', 2, 1),
('repairs', '2024-03-10', 100, 'Repair Service','INV-1005', 'Repairs in the kitchen', 1, 1),
('replacements', '2024-03-15', 50, 'Home Supplies', 'INV-1006', 'Replaced broken fixtures', 2, 1),
('new purchase', '2024-04-01', 1000, 'Furniture Store', 'INV-1007', 'New furniture for living room', 1, 2),
('returnofdeposit', '2024-04-15', 3000, 'Landlord', 'INV-1008', 'Returned deposit after move-out', 2, 2),
('other', '2024-05-01', 20, 'Miscellaneous', 'INV-1009', 'Miscellaneous payment', 1, 2),
('monthlyrental', '2024-05-15', 2500, 'Jane Smith', 'INV-1010', 'May rent payment', 2, 1);

INSERT INTO Issues (typeofIssue, locationofIssue, issuedescriptionDetails, dateOpen, dateClosed, issuestatusRemarks, issuecurrentStatus, issueSubmittedByID, issueResolvedByID) VALUES
('Aircon', 'Living Room', 'Air conditioning unit is not cooling properly.', '2024-01-10', NULL, 'Pending technician visit.', 'open', 1, 1),
('Heater', 'MasterBedroom', 'Heater is making a loud noise.', '2024-01-12', NULL, 'Waiting for parts to arrive.', 'wip', 2, 4),
('Lights', 'Kitchen', 'Light bulb is flickering and needs replacement.', '2024-01-15', NULL, 'Scheduled for replacement.', 'open', 1, 3),
('Plumbing', 'Bathroom', 'Toilet is leaking water.', '2024-01-20', '2024-01-21', 'Leak fixed by the plumber.', 'solved', 2, 3),
('Electrical', 'Bedroom', 'Wall socket is not working.', '2024-01-25', NULL, 'Electrician scheduled to check.', 'wip', 1, 5),
('Aircon', 'MasterBedroom', 'Aircon remote not functioning.', '2024-01-30', NULL, 'Replacement remote ordered.', 'unresolved', 2, 6),
('Lights', 'Living Room', 'Ceiling light is broken and needs to be replaced.', '2024-02-01', NULL, 'Pending order for replacement light.', 'open', 1, 7),
('Plumbing', 'Kitchen', 'Sink is draining slowly.', '2024-02-05', NULL, 'Waiting for plumber to arrive.', 'wip', 2, 8),
('Electrical', 'Toilet', 'Flickering light in the toilet.', '2024-02-10', '2024-02-12', 'Issue resolved by electrician.', 'solved', 1, 3),
('Other', 'Bedroom', 'Miscellaneous issue with the closet door.', '2024-02-15', NULL, 'Pending assessment.', 'open', 2, 9);

