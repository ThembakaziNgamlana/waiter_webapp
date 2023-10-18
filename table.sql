CREATE TABLE waiters (
    waiter_id SERIAL PRIMARY KEY,
     waiter_name VARCHAR(255) NOT NULL  UNIQUE
);

-- Create a table for selected days
CREATE TABLE selected_days (
    selected_day_id SERIAL PRIMARY KEY, 
    day_name VARCHAR(255) NOT NULL, 
);

CREATE TABLE waiter_schedule (
    id SERIAL PRIMARY KEY,
     waiter_id INT,
     selected_day_id INT,
    FOREIGN KEY (waiter_id)  REFERENCES waiters(waiter_id),
    FOREIGN KEY (selected_day_id) REFERENCES selected_days(selected_day_id)
);


    



