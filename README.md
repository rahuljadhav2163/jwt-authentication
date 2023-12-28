## JWT Authentication

##### To build Build a full-stack application that implements JSON Web Token (JWT) authentication with both access and refresh tokens. The application should include user signup, login, and logout functionalities. Additionally, create a protected API endpoint that returns a message but is only accessible to logged-in users. The access token should expire every 5 minutes.

### Features

### User Authentication :
##### I have a Implement user signup and login endpoints to secure password hashing for storing user passwords.

###  JWT Implementation :
##### On successful login, generate an access token and a refresh token (longer-lived). Store the refresh token in the database or a secure cookie.

### Token Refresh Mechanism :
##### Create an endpoint to refresh the access token using the refresh token. Implement logic to validate the refresh token and issue a new access token

### Logout Functionality :
##### I Implement logout functionality that invalidates the refresh token

### Protected API Endpoint :
##### Create an API endpoint that returns a simple message that is 'hellow user this is protected message'.Ensure this endpoint is accessible only to authenticated users with a valid access token.

### User Interface : 
##### Develop a simple yet intuitive user interface for signup, login, and logout & Provide feedback to the user

### Handling Tokens :
##### Implement logic to store, retrieve, and use tokens for making authenticated API requests. Handle token expiration and prompt for re-authentication or token refresh.
