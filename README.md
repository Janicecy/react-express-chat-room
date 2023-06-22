# react-express-chat-room 
A real-time chat room application that leverages Socket.IO\
## Built With
- React
- Express.js
- PostgreSQL
- Socket.IO
## Setup
Update `db.js` to connect with your local PostgreSQL setup. 
```
const db = new Sequelize(process.env.DATABASE_URL || "YOUR_PostgreSQL_CONNECTION_URI_HERE", {
  logging: false
});
```
To run this project, install it locally using npm or yarn:
```
yarn global add nodemon
yarn install
```
## Launch
```
./client
yarn start

./backend
yarn start 
```
## Screenshots
![Image text](https://github.com/JANICECY/react-express-chat-room/blob/master/demo_images/laptop_mainPage.png)
<img src="https://github.com/JANICECY/react-express-chat-room/blob/master/demo_images/mobile_chatRoom.png" width=400/>
<img src="https://github.com/JANICECY/react-express-chat-room/blob/master/demo_images/mobile_userList.png" width=400/>
![Image text](https://github.com/JANICECY/react-express-chat-room/blob/master/demo_images/laptop_chatRoom.png)
