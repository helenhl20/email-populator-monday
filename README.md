## Overview

This is Helen's "Quickstart Integration" example Monday app.

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

<br>
3. Run node modules install:

```
$ npm install
```

## Configure Monday App

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
   <br> ![Screenshot](/images/action_selections.png)

### Create a new custom action

1. Click "Choose action"
2. Click "Create new action"
3. Name your action "Populate email"
4. Type in the "Run URL" field: https://{NGROK_URL}/transformation/transform (make sure it's https: and not http:). 
   <br> \*\* we will update the {NGROK_URL} placeholder later when we will bring up our local server. 
5. Add the following input fields that our action will need in order to run:
   <br>Board - boardId
   <br>Item - itemId
   <br>Column - sourceColumnId
   <br>Column - targetColumnId
   <br> ![Screenshot](/images/custom_action_selections.png)
6. Click "Create action"

### Configure your custom action in the recipe

1. Choose your custom action in the recipe
2. Type “transform to {Text column, targetColumnId}” in the "Sentence" field
3. Configure the action input fields as follows:
   <br>boardId - Trigger Output (boardId)
   <br>itemId - Trigger Output (itemId)
   <br>sourceColumnId - Trigger Output (columnId)
   <br>targetColumnId - Recipe Sentence (Text column type)
   <br> ![Screenshot](/images/trigger_selections.png)
   4.Click "Create Recipe" button

## Run the project

1. Add your MONDAY_SIGNING_SECRET to the relevant field in the .env file
   <br> \*\* To get your MONDAY_SIGNING_SECRET go to monday.com, open Developers section, open your app and find the Signing Secret in "Basic Information" section
   <br> ![Screenshot](https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/uploads/VladMystetskyi/4db4f03e-67a5-482d-893e-033db67ee09b_monday-Apps2020-05-1901-31-26.png)
2. Add your API key to the API_TOKEN field in the .env file
  <br> \*\* To get your API_TOKEN go to your admin section in your monday.com account, open the API tab, and copy-paste your token in the relevant section
  <br> ![Screenshot]
3. Run the server with ngrok tunnel with the following command:
```
$ npm start
```
3. Open http://localhost:4040/status to get your ngrok public url

4. Open up your custom action "Populate email" again to update the {NGROK_URL} part in "Run URL" field with the ngrok public url from the localhost4040/status page
<br>\*\* Note that on every restart of the server, your ngrok url will change, so you need to change "Run URL" field in the action.
If you want to actively change the server-side code and restart the server (as well as debug your program), you can run `npm run server` and `npm run expose` in 2 different terminal windows

## Add your recipe to a board

1. Go to any board at monday.com (it should have at least 2 text columns) and add your new integration recipe to it
2. Configure your source and target columns in your recipe
3. Add and remove users from your Person column selected in the source column, and in a few moments the Text column selected will be updated with the transformed text
4. Enjoy your recipe!
