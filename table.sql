CREATE TABLE waiters (
    waiter_id SERIAL PRIMARY KEY,
     waiter_name VARCHAR(255) NOT NULL  UNIQUE
);

-- Create a table for selected days
CREATE TABLE selected_days (
    selected_day_id SERIAL PRIMARY KEY, 
    waiter_id INT,
    day_name VARCHAR(255) NOT NULL, 
);


-- Create a table for waiter assignments


CREATE TABLE new_waiter_schedule (
    new_waiter_schedule_id SERIAL PRIMARY KEY,
    waiter_id INT,
    selected_day_id INT,
    FOREIGN KEY (waiter_id) REFERENCES waiters(waiter_id),
    FOREIGN KEY (selected_day_id) REFERENCES selected_days(selected_day_id)
);


    



