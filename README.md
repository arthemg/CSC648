# csc648-fall17-team12

## Instructions on how to test locally

These instructions assume you have MySQL Community Server and MySQL Workbench installed.
If not: https://dev.mysql.com/doc/workbench/en/wb-installing.html

## Setting up the database

### Using Terminal

1. SSH into the team server and `cd` into the `/nodeApp` directory.

2. Type the following two commands to inject the two tables into our MySQL Database:
..* ```mysql -u fa17g12 -p fa17g12 < listings.sql```
..* ```mysql -u fag17g12 -p fa17g12 < t_user.sql``` 

3. Thats it, the database `fa7g12` will now have the above tables injected into it.

### Using Workbench (Note: this will not work on the team server, as schema permissions are not granted)

1. Open up MySQL Workbench and create a new connection if one is not already made.

   To do this, press the + next to MySQL Connections. Name the connection anything you like, and set the password if you had set one during configuring the installation.
   You can test the connection with the **Test Connection** button, then confirm by pressing **OK**.

2. Connect to your server with the connection you have by clicking on it once.

3. On the left, you should see a navigation box with *Management*, *Instance*, and *Performance*. At the bottom of the box, you can see *Schemas*. Click the little icon of two arrows facing away from each other to the right of *Schemas*.

   The box now shows you what databases (schemas) are in your server. There might be none now, but that's okay.

4. Now we can create a new database for our server. 

   Right click the navigation box and select **Create Schema...** 

   Name it anything, for example *test*, then click **Apply**. You'll get a pop up to review the code that actually creates the database. You can simply press **Apply** once more.

5. Next, we are going to create tables with the given .sql files located in our **_nodeApp_** folder in the files that you cloned from GitHub. 

   Up at the top navigation bar with *File*, *Edit*, etc., go to *Server* and click **Data Import**. 

   Select the option, *Import from Self-Contained File* and then click the icon with the ''..." on the right to navigate to the **_nodeApp_** folder with the .sql files, **listings.sql** and **t_user.sql**.  

   After selecting one of the files, below where you clicked *Import from Self-Contained File*, you can select a *Default Target Schema*. In this case, it is the database that you created earlier.

6. Repeat the process for the other .sql file. 

7. You are finished setting up the database! From now on, all you need to remember is how to import .sql files for future testing.

## Changing the server.js file

1. Open up the **server.js** file in the **_nodeApp_** folder.

2. On line 26 and 27, you'll see

   ```javascript
   password : '',

   database : 'test',
   ```

   Change 'test' to whatever you named your database earlier on, and set the password if you have one on your server.

## Testing the search

1. Open up your terminal and navigate to the folder with the server.js file in it and run it.

   ```
   node server.js
   ```

2. Open up a browser and do localhost:3000 for the url.

3. Try out the search. If you type in Mas Banyar in user search, you should get similar names that start with Mas. In listings search, type in San Francisco and you should also get similar cities that start with San.

   Note that the search only works if you press the button. Don't press enter in the search bar! We'll get around to implementing that.

   ​
