# How to Run the Backend 🚀

## Prerequisites ⚙️

Before you begin, ensure that the following are installed on your machine:

- **Java 24** 
- **Maven 3.8.7** 

---

Follow the steps below to get the backend up and running:

1. **Navigate to the Project Root Directory** 📂  
   Open the root folder of the project on your local machine.

2. **Configure the `application.properties` File** ⚙️  
   Edit the `application.properties` file and provide your MySQL database details:
   - `db_name`
   - `db_username`
   - `db_password`

3. **Build the Project** 🔨  
   Run the following command in your terminal to clean and install the project dependencies:
   ```bash
   mvn clean install
4. **Start the Application** ▶️
   Once the build is complete, run the following command to start the backend:
   ```bash
   mvn spring-boot:run
