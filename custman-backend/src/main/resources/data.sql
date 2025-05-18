-- Countries
INSERT IGNORE INTO countries (name) VALUES
    ('Sri Lanka'),
    ('India'),
    ('USA');

-- Insert Cities using subqueries to fetch country_id by name
INSERT IGNORE INTO cities (name, country_id)
VALUES
    ('Colombo', (SELECT id FROM countries WHERE name = 'Sri Lanka')),
    ('Kandy', (SELECT id FROM countries WHERE name = 'Sri Lanka')),
    ('Chennai', (SELECT id FROM countries WHERE name = 'India')),
    ('Mumbai', (SELECT id FROM countries WHERE name = 'India')),
    ('New York', (SELECT id FROM countries WHERE name = 'USA')),
    ('Los Angeles', (SELECT id FROM countries WHERE name = 'USA'));
