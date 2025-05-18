# Customer Management

Frontend: React + Axios
Backend: Java + Spring Boot + JPA
Database: MariaDB

- You need to create a database with the name crm.
- If you need to use a different database, please create one accordingly and update the spring.datasource.url value in application.properties file.
- Also change the username and the password in the same file.
- When running the backend, the tables will be created automatically, if they do not exist.
- The frontend assumes the backend to run on the default address of localhost:8080.
- If this is different, please change the frontends src/urls/urls.js file accordingly.