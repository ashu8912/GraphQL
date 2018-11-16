import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getUserId from '../Utils/getUserId';
const Mutation={
    async createUser(parent,args,{prisma},info)
    {

    if(args.data.password.length<8)
    {
        throw new Error("Password must be 8 Charaters or longer")
    }  
    const hashedPassword=await bcrypt.hash(args.data.password,10)  
const emailTaken=await prisma.exists.User({email:args.data.email});
if(emailTaken)
{
throw new Error('Email Already Taken');
}
const user=await prisma.mutation.createUser({data:{...args.data,
                                  password:hashedPassword
                                }
                            })
       return {
           user,
           token:jwt.sign({id:user.id},"mySecret")
       }                     

    },
    async login(parent,args,{prisma},info){
        const user=await prisma.query.user({
            where:{
                email:args.data.email
            }
        });
        if(!user)
        {
            throw new Error("User with This Email Doesn't Exist")
        }
        console.log(user);
       const isMatch=await bcrypt.compare(args.data.password,user.password);
       if(!isMatch)
       {
           throw new Error("Invalid Password");
       }
      return {
          user:user,
          token:jwt.sign({id:user.id},"mySecret")
      }
},
    createPost(parent,args,{pubsub,db,prisma,request},info){
        const userId=getUserId(request);
        return prisma.mutation.createPost({
            data:{...args.data,
            author:{
                connect:{
                    id:userId
                }
            }},
    },info)
    },
    createComment(parent,args,{pubsub,db,prisma,request},info)
    {const userId=getUserId(request);
        const isPostPublished=await prisma.exists.Post({
            id:args.post,
            published:true
        });
        if(!isPostPublished)
        {
            throw new Error("Post Not Found");
        }
        return prisma.mutation.createComment({
            data:{...args.data,post:{
                connect:{
                    id:args.post
                }
            },
            author:{
                connect:{
                    id:userId
                }
            }}
        },info)
    },
    updateUser(parent,args,{prisma,request},info)
    { const userId=getUserId(request)
        return prisma.mutation.updateUser({
             data:{...args.data},
             where:{
                 id:userId
             }
        },info)
    },
async updatePost(parent,args,{prisma,request},info)
{const userId=getUserId(request);
    const postExists=prisma.exists.Post({
        id:args.id,
        author:{
            where:{
                id:userId
            }
        }
    })
const isPostPublished=prisma.exists.Post({
    id:args.id,
    publihsed:true
})
    if(!postExists)
    {
        throw new Error("Unable To Update");
    }
    if(isPostPublished && args.data.published===false)
    {
        await prisma.mutation.deleteManyComments({
               where:{
                   AND:[
                       {
                           author:{
                               id:userId
                           }
                       },
                       {
                           post:{
                               id:args.id
                           }
                       }
                   ]
               }
        })
    }
 return prisma.mutation.updatePost({
     where:{id:args.id},
     data:{...args.data}
 },info)   

},
async updateComment(parents,args,{db,prisma,request},info){
    const isUsersComment=prisma.exists.Comment({
        where:{
            id:args.id
        },
        author:{
            where:{
                id:args.id
            }
        }
    })
    return prisma.mutation.updateComment({
       data:{...args.data},
       where:{
           id:args.id
       }
    },info)
    
},
    async deleteUser(parent,args,{prisma,request},info)
    {const userId=getUserId(request);
        const userExists=await prisma.exists.User({id:args.data.id});
        if(!userExists)
        {
   throw new Error("User doesn't exist");
        }
        return prisma.mutation.deleteUser({where:{
            id:userId
        }},info);
    
},
async deletePost(parent,args,{prisma,request},info)
{
const userId=getUserId(request);
const isUsersPost=prisma.exists.User({
    where:{
        id:args.post
    },
    author:{
        where:{id:userId}
    }
})
if(!isUsersPost)
{
    throw new Error("Unable To Delete Post");
}
return prisma.mutation.deletePost({
    where:{
        id:args.post
    }
},info);
},
async deleteComment(parent,args,{prisma,request},info)
{
const userId=getUserId(request);
const isUsersComment=prisma.exists.Comment({
    where:{
        id:args.comment
    },
    author:{
        where:{id:userId}
    }
})
return prisma.mutation.deleteComment({
    where:{
       id:args.comment
    }
})
}
}
export default Mutation;