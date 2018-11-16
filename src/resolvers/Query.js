
import getUserId from '../Utils/getUserId';

const Query={
    comments(parent,args,{prisma},info){
        const opArgs={};
        if(args.query)
        {
            opArgs.where={
                text_contains:args.query
            }
        }
    return prisma.query.comments(opArgs,info);
        //     if(!args.query)
    //     {
    //         return db.comments;
    //     }
    //  return db.comments.filter((comment)=>{
    //      return comment.toLowerCase().include(args.query.toLowerCase())
    //  })
    },
     users(parent,args,{ prisma },info){
        const opArgs={};
        console.log(prisma);
        if(args.query)
        {
        opArgs.where={
            OR:[{name_contains:args.query}]
        }
        }
        console.log(opArgs);
         return prisma.query.users(opArgs,info);
},
     
 posts(parent,args,{prisma},info){
    let opArgs={};
    
    opArgs.where={
        published:true
    } 
    if(args.query)
     {
   opArgs.where.OR=[{
       title_contains:args.query
   },{
       body_contains:args.query
   }]
     }
    return prisma.query.posts(opArgs,info);
    //  if(!args.query)
    //  {
    //      return db.posts;
    //  }
    //  return db.posts.filter((post)=>{
    //    return post.title.toLowerCase().include(args.query.toLowerCase())
    //  }) 
     
 },
 async myPosts(parent,args,{prisma,request},info){
     const userId=getUserId(request);
     return prisma.query.posts({
         where:{
             author:{
                 id:userId
             }
         }
     })
 },
 async post(parent,args,{prisma,request},info)
 {
     const userId=getUserId(request,false);
     const posts=await prisma.query.posts({
         where:{
             id:args.id,
             OR:[{
                 published:true
             },{
                 author:{
                     id:userId
                 }
             }]
         }
     },info)
     if(posts.length===0)
     {
         throw new Error("Posts Not Found");
     }
     return posts[0];
 }
}
 export default Query;