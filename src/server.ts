import { ApolloServer, gql } from "apollo-server";
import bcrypt from 'bcrypt'
import random, { randomUUID } from 'node:crypto'
import dotenv from 'dotenv'
dotenv.config()

/*
*under feching
*Rota http que retorna menos dados
*
*Over feching   
*Rota http que retorna mais dados do que precisamos

*/
// o nosso schema = typeDefs
//primeiro trabalhamos com schimas=typeDefs depois vamos para controller/resolvers

/*
Existe uma outra abordagem denominada codefirast
*nessa abordagem o schema é criado de forma automáica com base no nosso code
*/ 

const typeDefs = gql` 
         type Mutation{
            createUser(name:String!, email:String!, pass:String!): user!,
            
         
        }


    
             type user{
            id:String!,
            name:String!,
            email:String!,
            pass:String!
        }


        type Query {
        users: [user]!
        }
        
       

        
 `

 interface User {
    id:string,
    name:string,
    email:string,
    pass: string

 }
const users: User[] = []
//para criar o servidor 
const server = new ApolloServer({
    typeDefs,
    resolvers:{
        Query:{
            users: () =>{
                return users
            }
        },

        Mutation:{
            createUser : async(_:any, args:User) => {
               const  hash = await bcrypt.hash(args.pass, 10) 
                const user ={
                    id: randomUUID(),
                    name: args.name,
                    email: args.email,
                    pass:hash
                }
                users.push(user)
                return user
                
            }
    
        },
    },

   
})


const port = process.env.PORT



server.listen(port, () =>{
    console.log(`the server is running on ${port}`)
})