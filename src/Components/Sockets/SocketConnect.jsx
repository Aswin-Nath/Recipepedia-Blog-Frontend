import {io} from "socket.io-client";

const API1="http://127.0.0.1:5000/";
const API2="https://recipepedia-blog-backend.onrender.com/";
const socket=io(API2,{
    auth:{
        token:localStorage.getItem("token")
    }    
});
export default socket;