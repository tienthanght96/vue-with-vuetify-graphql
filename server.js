const { ApolloServer, AuthenticationError } = require("apollo-server");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const jwt = require('jsonwebtoken');

// import typdeDefs and resolvers
const filePath = path.join(__dirname, "typeDefs.gql");
const typeDefs = fs.readFileSync(filePath, 'utf-8');
const resolvers = require("./resolvers");

// import eviroment variables and mongoose modal
require("dotenv").config({ path: "variables.env" });
const User = require("./models/User");
const Post = require("./models/Post");

// connect database
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true,  useCreateIndex: true, })
  .then(() => {
    console.log("Database connected");
  })
  .catch(error => console.log(error));

// verify jwt token passed from client
const getUser = async token => {
  if(token) {
    try {
      const user = await jwt.verify(token, process.env.SECRET);
      return user;
    } catch (error) {
      throw new AuthenticationError('Your session has ended. Please sign in again !');
    }
  }
}

// create Apollo/GraphQL server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    return { name: error.name, message: error.message };
  },
  context: async ({ req }) => {
    const token = (req.headers['authorization'])
    return {
      User,
      Post,
      currentUser: await getUser(token)
    };
  },
});

server.listen().then(({ url }) => {
  console.log(`Server listening....port: ${url}`);
});
