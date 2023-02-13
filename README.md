# Reddit clone server

Back end for Blog MERN stack app.

Code for the front end can be found [here](https://github.com/hectorgonzalezo/blog_client).

By [Héctor González Orozco](https://github.com/hectorgonzalezo)

## :computer: Built With

* [NodeJS](https://nodejs.org/)
* [MongoDB](https://www.mongodb.com/)
* [ExpressJS](https://expressjs.com/)


## :pager: API URL

Hosted at: [https://blog-server.herokuapp.com/](https://blog-server.herokuapp.com/);

## :rocket: Features

- Users can sign up and log in without keeping a server side session by using [passportjs](http://www.passportjs.org/) with [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken).

- Two permission levels for users: regular and administrator.

- Only administrators can add, edit and delete posts.

- Regular users can add and edit comments.



## :construction: Installing

1. Clone the repository

`git clone https://github.com/hectorgonzalezo/blog_server`

2. Install dependencies

`npm install`

3. Create a .env file on root directory of project with Mongo DB URI and authorization string. The format must be the following:

`MONGODB_URI="mongoUri"`
`AUTH_SECRET="randomString"`

4. Start the server

`npm start`

Typescript code can be compiled by using the following command:

`npm run build`

Alternatively, The server can be started and compiled in real-time after detecting changes by using:

`npm run dev`
