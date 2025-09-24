# Employee Management System (Node.js CLI)

The **Employee Management System** is a beginner-friendly **Command-Line Interface (CLI) project** developed using **Node.js**.  
It allows users to **add, view, and remove employees** directly from the terminal in a simple, interactive way.  

This project demonstrates how to build a **menu-driven application** in Node.js, making use of arrays, functions, and the **readline module** for user interaction.  

---

## Project Structure
- **employee.js** → The core JavaScript file that contains all the logic for the program.  

---

## Features
1. **Add Employee** → Add a new employee by entering their name and unique ID.  
2. **List Employees** → View all employees currently stored in the system.  
3. **Remove Employee** → Delete an employee record using their ID.  
4. **Exit** → Close the program safely with a farewell message.  

---

## How It Works
1. When the program starts, it displays a **welcome message** along with a menu of options.  
2. The user chooses an option by typing the corresponding number.  
3. Based on the selection:  
   - **1 → Add Employee** (enter employee name & ID).  
   - **2 → List Employees** (show all stored employees).  
   - **3 → Remove Employee** (delete employee by ID).  
   - **4 → Exit** (close the program).  

---

## Code Explanation
The system is built step by step with the following components:  

### 1. Interface Setup
- The program uses **Node.js’s `readline` module** to read user input and print output to the terminal.  
- `readline.createInterface()` sets up the input/output stream for interaction.  

### 2. Data Storage
- Employee records are stored in an **array** called `employees`.  
- Each employee is represented as an object with:  
  - `id` → Unique identifier (entered by the user).  
  - `name` → Employee’s name.  

### 3. Menu Display
- The function `showMenu()` prints the available options (Add, List, Remove, Exit).  
- Based on user input, the program calls the appropriate function.  

### 4. Adding Employees
- `addEmployee()` prompts the user to enter both **name** and **ID**.  
- A new employee object is created and pushed into the `employees` array.  

### 5. Listing Employees
- `listEmployees()` checks if there are employees in the array.  
- If yes, it displays each employee with their ID and name.  
- If no employees exist, it shows: *“No employees found.”*  

### 6. Removing Employees
- `removeEmployee()` asks the user for an **employee ID**.  
- The array is searched for a matching ID.  
- If found, the employee is removed.  
- If not found, a message appears: *“Employee not found.”*  

### 7. Exiting the Program
- Choosing option **4** gracefully ends the program using `rl.close()`.  
- A goodbye message is displayed.  

### 8. Unique Identity
- For identification, the menu header includes:  
  **`23BAD10013-GAURAV SOOD`**  

---

## Usage
1. Open a terminal.  
2. Navigate to the folder where `employee.js` is saved.  
3. Run the program using:  

```bash
node employee.js
```

## Outputs
### Adding an Employee
![Add Employee](images/Add_Employee.png)

### Listing Employees
![List Employees](images/List_Employee.png)

### Removing an Employee
![Remove Employee](images/Remove_Employee.png)

### Invalid Employee ID
![Invalid ID](images/Invalid_ID.png)

### Exiting the System
![Exit](images/Exit.png)

## Learning Outcomes
By building this project, you will:  
- Learn how to create a **menu-driven CLI program** in Node.js.  
- Understand the **readline module** for handling interactive user input.  
- Strengthen concepts of **arrays** with operations like insert, display, and delete.  
- Gain practice in **functions, conditionals, and modular programming**.  
- Discover how to manage **in-memory data** without needing databases.  
- Build confidence in designing **real-world, small-scale applications**.  