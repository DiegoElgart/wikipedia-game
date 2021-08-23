#wikipedia-game
A game project by @msemrik and @DiegoElgart



###First time running in this repo? Don't worry, follow these steps:

####SERVER
1. move to "server" folder: `cd server`
2. Install npm dependencies: `npm install`
3. Build the project (convert ts into js, run code cleaning tools, etc): `npm run build`
4. Start the server: `npm start`

You can check if it's working heading to http://localhost:4000 in your browser.

######LOGIN
For login-in you should call /login API sending email and password:

`curl -X POST -i localhost:4000/login -H "Content-Type: application/json"  -d '{"email": "msemrik@gmail.com","password": "msemrik"}'`

Hardocded users: 
1. email: msemrik@gmail.com password: msemrik
2. email: diego@gmail.com password: diego

This will return a cookie (something like: connect.sid=examplesid) you should include when calling any authenticated-required API.
i.e:

`curl -X POST -i localhost:4000/game/start -H "Content-Type: application/json" -d '{"language":"en"}' -H "Cookie: connect.sid=s%3AZZ8hk69JVl8fnrYMwtYBhLgWZSu2q_58.8ySaSgpswDmv4Cz2cmFZV9okW%2BwZYaTIdcGQcRZXf4Q"`

######Want to DEBUG?
1. Builds the server code, and start it in debug mode: `npm run debug`
2. Connect your favourite IDE to localhost:9229