let users=[{
    id:"abc123",
    email:"qwe@gmail.com",
    name:"Ashu",
    age:21
},{
    id:"rstyu",
    name:"Aniket",
    email:"srt@gmail.com",
    age:28
},{
    id:"qwert",
    name:"Alok",
    email:"uiyt@gmail.com",
    age:24
}]
let posts=[{
    title:"this is basic GraphQL",
    id:"retq",
    author:"abc123"
},{
    title:"we are the legends",
    id:"toqworq",
    author:"rstyu"
}]
let comments=[
    {text:"this is Good",
    post:"retq",
    author:"abc123"
}
]
const db={
    users,
    posts,
    comments
}
export {db as default}