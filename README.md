## Overview

This is Helen's "Quickstart Integration" example custom integration monday.com app.

<br>It can be used as a board recipe, which inserts a user's email address into a Text column when said user is selected (or unselected) from a Person column. 

<br>This app demonstrates how to build:
- a custom integration recipe
- a custom action

## Install

1. Make sure you have Node (v10+) and npm installed

2. Use the correct node version:
```
$ nvm use
```
3. Run node modules install:
```
$ npm install
```
4. You can then either download this Github file manually, or you can clone it onto your local system for editing!

## Configure Your monday.com Custom App

### Create a new app and an integration feature

1. Open monday.com, login into your account, and go to your "Developers" section.
2. Create a new "Integration Example App"
3. Open the "Features" section and create a new "Integration" feature

### Create a new recipe and a custom trigger

1. Open the "Recipes" tab
2. Click "Add new recipe"
3. Click "Choose trigger" and choose "When a column changes" trigger

4. Type "When {Person column, columnId} changes" in the "Sentence" field
   <br>(In this case, the "Person column" will be the underlined part of the recipe you will be clicking into, and the "columnId" will be the data that is sent to your custom app.)
   
5. Configure the trigger input fields as follows:
   <br>boardId - Context
   <br>columnId - Recipe Sentence (Person Column)
   <br>![Screenshot](/images/trigger_selections.png)

### Create a new custom action

1. Click "Choose action"
2. Click "Create new action"
3. Name your action "Populate email"

4. Type in the "Run URL" field: https://{NGROK_URL}/transformation/email (make sure it's https: and not http:). 
   <br> \*\* we will update the {NGROK_URL} placeholder later when we will bring up our local server. 
   
5. Add the following input fields that our action will need in order to run:
   <br>Board - boardId
   <br>Item - itemId
   <br>Column - sourceColumnId
   <br>Column - targetColumnId
   <br> ![Screenshot](/images/custom_action_selections.png)
   
6. Click "Create action"

### Configure Your Custom Action

1. Choose your custom action in the recipe
2. Type “update {Text column, targetColumnId}” in the "Sentence" field

3. Configure the action input fields as follows:
   <br>boardId - Trigger Output (boardId)
   <br>itemId - Trigger Output (itemId)
   <br>sourceColumnId - Trigger Output (columnId)
   <br>targetColumnId - Recipe Sentence (Text column type)
   <br> ![Screenshot](/images/action_selections.png)
   
4. Click the "Create Recipe" button

## Run the project

1. Add your MONDAY_SIGNING_SECRET to the relevant field in the .env file
   <br> \*\* To get your MONDAY_SIGNING_SECRET go to monday.com, open Developers section, open your app and find the Signing Secret in "Basic Information" section
   <br> ![Screenshot](/images/signing_secret.png)
   
2. Add your API key to the API_TOKEN field in the .env file
  <br> \*\* To get your API_TOKEN go to your admin section in your monday.com account, open the API tab, and copy-paste your token in the relevant section
  <br> ![Screenshot](/images/API_token.png) 
  
3. Run the server with ngrok tunnel with the following command:
```
$ npm start
```
4. Open http://localhost:4040/status to get your ngrok public url

5. Open up your custom action "Populate email" again to update the {NGROK_URL} part in "Run URL" field with the ngrok public url from the localhost4040/status page
<br>\*\* Note that on every restart of the server, your ngrok url will change, so you need to change "Run URL" field in the action.
If you want to actively change the server-side code and restart the server (as well as debug your program), you can run `npm run server` and `npm run expose` in 2 different terminal windows

## Add your recipe to a board

1. Go to any board on your monday.com account (it should have at least one Person column and one Text columns) and add your new, custom integration recipe to it
2. Choose your source and target columns in your custom integration recipe
3. Add and remove users from your selected Person column, and in a few moments the Text column selected will be updated with the user's email
4. Enjoy your custom integration recipe!

## How This Custom Integration Works

The changes to this custom integration starter code file are in the "integration_routes.js" file, the "monday-service.js" file, as well as the "integration-controller.js" files. Let's go through them one by one! 

### File Changes

1. In the "monday-service.js" file, I added the new async function "getUserEmail." This function queries a user's email data based off of their user ID. Keep in mind, this async function only runs once, and is only able to retrieve the first user's email from the query. 

2. In the "integration-controller.js" file, I added the new async function "populateTextColumnFromPeopleColumn," and also inserted internal notes walking through each line of code that was implemented. A high level summary of this function is, it uses the functions from the "monday-service.js" file to query the value from the Person column selected. 

   <br>The function then separates the value of this column, transforms the data from a JSON string to a JSON object, so that we can create a list of user IDs. This list of user IDs is then fed into the "getUserEmail" async function from the "monday-service.js" file to generate a list of user emails associated with those user IDs. 
   
   <br>This list of user emails is transformed back into a JSON string type (making sure to separate each email by a space, then a semicolon, then another space to fulfill the Text column requirements for storing multiple emails). 
   
   <br>Finally, this list of JSON strings is pushed back into the Text column selected by the user in the integration recipe using the "changeColumnValue" function in the "monday-service.js" file. 

3. In the "integration-routes.js" file, I created a new router post method that establishes a new URL address that the user can paste into their custom integration recipe to establish an endpoint URL for their transformed data!


