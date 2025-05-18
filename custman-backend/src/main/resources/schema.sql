-- Countries master table
CREATE TABLE IF NOT EXISTS countries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Cities master table
CREATE TABLE IF NOT EXISTS cities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country_id INT NOT NULL,
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE,
    UNIQUE (name, country_id)
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    date_of_birth DATE NOT NULL,
    nic VARCHAR(20) NOT NULL UNIQUE
);

-- Mobile numbers (optional, multiple)
CREATE TABLE IF NOT EXISTS mobile_numbers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mobile_number VARCHAR(20),
    customer_id BIGINT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Addresses (optional, multiple)
CREATE TABLE IF NOT EXISTS addresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    address_line_1 VARCHAR(200),
    address_line_2 VARCHAR(200),
    city_id INT,
    country_id INT,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL,
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE SET NULL
);

-- Family members (each one is also a customer)
CREATE TABLE IF NOT EXISTS customer_family_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    family_member_id BIGINT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (family_member_id) REFERENCES customers(id) ON DELETE CASCADE,
    UNIQUE (customer_id, family_member_id)
);
