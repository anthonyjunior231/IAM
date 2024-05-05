# IAM (Identity Access Management)

## Description
IAM is an identity management application built for organizations to manage file access and authentication using role-based access control (RBAC). It provides features for user management, file access control, logging, and more.

## Installation
To run the application locally, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd iam
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Configure environment variables:
   - Duplicate a `.env` file from the `.env` in the root directory.
   - Add necessary environment variables such as database credentials, Firebase configurations, etc.

5. Start the backend server:
   ```
   npm run start-server
   ```

6. Start the frontend development server:
   ```
   npm run start-client
   ```

7. Access the application in your web browser at `http://localhost:3000`.

## Dependencies
- React
- Node.js
- TypeScript
- PostgreSQL
- Firebase

## Usage
- Superadmin can create users and manage permissions.
- Users can log in, view files and folders, request access, and update files.
- Logs are accessible for auditing purposes.

## Postman Documentation
Explore the API endpoints using Postman: [IAM API Documentation](https://documenter.getpostman.com/view/9070802/2sA3Bj9E27)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

