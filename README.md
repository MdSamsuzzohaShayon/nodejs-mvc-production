*Tutorial* __https://www.youtube.com/watch?v=XlvsJLer_No&list=PLZlA0Gpn_vH8jbFkBjOuFjhxANC63OmXM&index=1__


# Heroku setup 

 1. Create new app

  ![](/screenshots/1.png)

 2. Set an app name that is available

  ![](/screenshots/2.png)

 3. Choose any deployment method you like (Here I will use Heroku cli)
   - download heroku cli and install is and 
   - use those following commands 

  ![](/screenshots/3.png)

 4. Go to app setting setup variable that we made in .env file in our project

  ![](/screenshots/4.png)

 5. setup for mongodb variable 
   - the key from .env file in our project
   - value is from mongodb atlas or mlab or any other cloud that deply db and running globally

  ![](/screenshots/5.png)

*Now open the app*


### File Management

 - There are few ways to upload file. 
 - In heroku file system when we upload our files and restart heroku server files will delete automitacally
 - **Best Solution** is to upload this files to a seperate file server such as Amazon s3 or any other file storage system (All are paid)
 - Another easy way is to store file in database that is not ideal but it's free to play around with

 - **[Filepond](https://pqina.nl/filepond/)** A JavaScript library that can upload anything you throw at it, optimizes images for faster uploads, and offers a great, accessible, silky smooth user experience.
 [Github](https://github.com/pqina/filepond)
