CREATE TABLE waiters (
    waiter_id SERIAL PRIMARY KEY,
     waiter_name VARCHAR(255) NOT NULL  UNIQUE
);



CREATE TABLE new_selected_days (
    id SERIAL PRIMARY KEY,
    days VARCHAR(255) NOT NULL
);


    
CREATE TABLE waiter_schedule (
    new_waiter_schedule_id SERIAL PRIMARY KEY,
     waiter_id INT REFERENCES waiters(waiter_id) ON DELETE CASCADE,
     selected_day_id INT REFERENCES new_selected_days(id) ON DELETE CASCADE 
);

