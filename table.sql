CREATE TABLE waiters (
    waiter_id SERIAL PRIMARY KEY,
     waiter_name VARCHAR(255) NOT NULL  UNIQUE
);

-- Create a table for selected days
CREATE TABLE selected_days (
    selected_day_id SERIAL PRIMARY KEY, 
    waiter_id INT, 
    day_name VARCHAR(255) NOT NULL, 

    FOREIGN KEY (waiter_id) REFERENCES waiters (waiter_id)
);






