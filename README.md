# InstaConnect
InstaConnect is a web application that allows users to connect, create and share content among themselves. Overall this project can be considered a simplified clone of instagram or facebook. The project uses typical client server architecture with two subprojects making up the backend and frontend. In the backend two databases are used to power the application. Picture and video files are stored in Amazon S3 while user information and metadata is all stored in a Mongo DB database. From these two databases .NET is used to create a backend REST API. The frontend application is built using typescript and REACT. It sends requests to the backend application to query and display information to the user.

### How to Distribute
1. Create a zip file for the project from the `main` branch.
2. Share this zip file with the stakeholders.

### How to Build Locally
1. Extract the contents of the zip file or use the command `git clone https://github.com/philipmeneghini/InstaConnect.git` to install the project locally.
2. Ensure that you have the latest version of node, C#, .NET and Mongo DB installed on your local computer.
3. Setup an AWS account if you have not already. Additionally create a local instance of MongoDB.
4. Navigate to backend => appsettings.json. This file is your configuration file for the backend server. You will need to modify a couple of these fields
    - In the Amazon Credentials section fill in the access and secret key for a user you create in your AWS account for both the S3 and SES section respectively. 
    - Under the sections ConnectionString, UserModel, ContentModel and CommentModel make sure to fill in your local MongoDB database details. Each model will require a new collection to be made as well as an index. Feel free to name the collection as you want in your local Mongo DB instance but keep the keys the same as specified in the default appsettings.json file.
5. Open a terminal window and navigate to frontend. Run `npm install` to install all dependencies for the frontend. If an error is thrown try running the command `npm install --force` instead.
6. To start the project navigate to backend and frontend in two different terminal windows. In the frontend run `npm start` while in the backend run `dotnet run`. If the backend has any build errors try running `dotnet restore`.
