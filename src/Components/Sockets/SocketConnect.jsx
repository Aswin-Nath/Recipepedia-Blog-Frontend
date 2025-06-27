import {io} from "socket.io-client";


const socket=io("https://recipepedia-blog-backend.onrender.com/",{
    auth:{
        token:localStorage.getItem("token")
    }    
});
export default socket;