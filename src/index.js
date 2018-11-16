import {GraphQLServer,PubSub} from 'graphql-yoga';
import uuidv4 from 'uuid/v4';
import db from './db';
import {resolvers, fragmentReplacements} from './resolvers/index';
import prisma from './prisma';
const pubsub=new PubSub();
const server=new GraphQLServer({typeDefs:"./src/schema.graphql",
resolvers,
context(request){
    return {
        db,
        prisma,
        pubsub,
        request
    }},
    fragmentReplacements
})
server.start(()=>{
    console.log("running server")
})