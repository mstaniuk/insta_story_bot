#Bot * beep * * boop  *

Logs into instagram and ooks at teh insta stories of given users - saves them into ./media directory

##installation
* _you have to have nodejs installed_
* npm i
* copy .env.example
* rename .env.example to .env
* change data inside .env to correct one
* run *node app.js* from console

## known issues
* if you give wrong login data it won't break or warn
* if you get logged out druing scrapping users pages it wont break or warn

## other
* if you want to see actual browser work uncomment "headless: false" in config.js