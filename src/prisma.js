import {Prisma} from 'prisma-binding';
import {fragmentReplacements} from './resolvers/index';
const prisma=new Prisma({
typeDefs:'src/generated/prisma.graphql',
endpoint:'http://localhost:4466/socialmedia',
secret:'ashugraphql',
fragmentReplacements
});
export {prisma as default};
//prisma.query prisma.mutation prisma.subscription prisma.exists

// prisma.exists.User({
//     id:"abc123"
// }).then((exist)=>{
//     console.log(exist);
// })



const createPostForUser=async (authorId,data)=>{
    const userExists=await prisma.exists.User({
        id:authorId
    })
    if(!userExists){
        throw new Error("User Not Found");
    }
    const post=await prisma.mutation.createPost({
    data:{
        ...data,
    author:{
        connect:{
            id:authorId
        }
    }}
    
},'{author {id name posts {id title} }}')
return post.author;
}
const updatePostForUser=async (postId,data)=>{
    const postExists=await prisma.exists.Post({
        id:postId
    })
    if(!postExists)
    {
        throw new Error("Post Not Found")
    }
const post=await prisma.mutation.updatePost({
    where:{
        id:postId
    },
    data:{
        ...data
    }
},'{author {id name posts {id title}}}')
return post.author;
}
// updatePostForUser('cjodra035002l087146s2mxux',{
//     title:"It is All about Passion"
// }).then((user)=>{
//     console.log(JSON.stringify(user));
// }).catch((err)=>{
//     console.log(err.message);
// })
// createPostForUser('cjo7zw5yz001u0871pssx3zpu',{
//     title:"My struggle Story"
// }).then((user)=>{
//     console.log(JSON.stringify(user));
// }).catch((err)=>{
//     console.log(err);
// })













// prisma.query.users(null,'{id name email}').then((data)=>{
//     console.log(data);
// })
// prisma.mutation.createUser({
//     data:{name:"Alok Nath",
//     email:"alokNath28@gmail.com"}
// },'{id name email posts {id title}}').then((data)=>{
//     console.log(data);
// })
// prisma.mutation.createPost({
//     data:{
//         title:"How GaphQL will change the future",
//         author:{
//             connect:{
//                 id:"cjobecx5y002b087176r4xv7p"
//             }
//         }
//     }
// },'{id title author {name email}}').then((data)=>{
//     console.log(data);
// })