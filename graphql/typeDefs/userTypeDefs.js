const { gql } = require('apollo-server-express');

module.exports = gql ` 

	 type User {
		 id:ID!
		 name:String!
		 email:String!
		 task:[Task!]!
		 password:String
		 createdAt:Date
		 updatedAt:Date
	 }
	input signupInput {
		name:String!
		email:String!
		password:String!
	}
	input loginInput{
		email:String!
		password:String!
	}
	type Token {
		token:String!
	}

	extend type Mutation {
		signup(input:signupInput):User
		login(input:loginInput):Token
	}

	extend type Query {
		 user:User
	 }

	 extend type Subscription{
		 userCreated:User
	 }
	
`