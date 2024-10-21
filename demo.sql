-- 2 SELECT statements, 1 of the statemust must be able to filter the table by at least 2 criteria
SELECT * FROM Property_Details;
SELECT * FROM Property_Details WHERE numberofBedrooms = 2;

SELECT * FROM Property_Details WHERE numberofBedrooms >= 3 AND amenities LIKE "%pool%";

SELECT nameofProperty, baserentalAmount, numberofBedrooms, typeofUser, fullName, contactNumber 
FROM Property_Details JOIN Tenancy_Details JOIN User_Details WHERE typeofUser = "homeowner" 
ORDER BY nameofProperty, baserentalAmount, numberofBedrooms;

-- Perform at least 1 INSERT INTO statement on the table
INSERT INTO User_Details (typeofUser, fullName, contactNumber, email) VALUES
('staff', 'Joseph Yin', '98888888', 'josephyin@gmail.com');


-- Perform at least 1 UPDATE statement on the table
--update parents set first_name="Tang", last_name="Thomas" WHERE parent_id=1;
UPDATE User_Details set typeofUser='agent', fullName='Joseph Yin', 
contactNumber='91111111', email='josephyin@gmail.com' WHERE UserID = 11; 

-- Perform at least 1 DELETE statement on the table
--DELETE FROM parents WHERE parent_id = 3;
DELETE FROM User_Details WHERE UserID = 11;
