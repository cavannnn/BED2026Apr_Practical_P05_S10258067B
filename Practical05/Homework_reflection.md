1. Separation of Concerns

Distinct Responsibilities of the Model, View, and Controller:
In the final project structure, the Model is responsible for handling all database operations, including retrieving, creating, updating, and deleting (CRUD) records. The Controller acts as an intermediary between the View and the Model by processing requests, calling the appropriate Model functions, and returning responses. The View consists of the HTML, CSS, and JavaScript files that provide the user interface and interact with the API through HTTP requests.

How a Separate View Simplifies the Backend API:
Having a separate frontend View simplifies the backend because the API only needs to focus on processing requests and managing data. The backend no longer needs to handle how information is displayed to users, allowing each component to focus on its own responsibility. This separation results in a cleaner and more maintainable application structure.

2. Robustness and Security

Throughout the practicals, it became easier to identify and fix bugs once the application was refactored into the MVC architecture in Practical 04. By separating database operations, request handling, and validation into different files, issues could be isolated more easily. In Practical 05, the addition of a frontend View further improved debugging because browser developer tools could be used to inspect requests and responses between the client and the API.

3. Challenges and Problem Solving

Most Challenging Aspect:
The most challenging aspect was refactoring the application into the MVC structure while ensuring all files were connected correctly. Issues such as incorrect import paths, missing exports, and environment variable configuration errors often prevented the application from functioning as expected. These problems were resolved by carefully reviewing error messages, tracing dependencies, and testing each component individually until the error is located and fixed.

Adding New Features with MVC:
If a new feature such as a student email field or user authentication were added, the current MVC structure would provide a clear approach for implementation. Database changes would be handled in the Model, request processing would be updated in the Controller, validation rules would be added in Middleware, and the user interface would be modified in the View. This approach is significantly more organized than the Practical 03 structure, where most logic was contained within a single application file.

1. Experiential Learning

The hands-on implementation of MVC, validation, error handling, and parameterized queries provided a much deeper understanding than simply reading about the concepts. Refactoring the application demonstrated how MVC improves organization and maintainability, while implementing validation and error handling highlighted the importance of building reliable applications. Similarly, using parameterized queries reinforced the importance of separating user input from SQL statements to improve security and prevent SQL injection attacks.