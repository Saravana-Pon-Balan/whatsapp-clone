import * as Controller from "../app/controllers/index.js";
import * as validation from "../utility/validations.js";
const routes = (app) =>{
app.get('/', (req, res) =>{ 
        res.send("heloo")
});
app.post("/user",validation.validateCreateUser,Controller.createUser);
app.post("/channel",validation.validateCreateChannel,Controller.createChannel)
app.get("/search-user",validation.validateSearchUser,Controller.searchUser)
app.get("/channel-list",validation.validateGetChannelList,Controller.getChannelList)
app.post("/message",validation.validateAddMessage,Controller.sendMessage)
app.get("/message",validation.validateGetMessage,Controller.getMessage)
      
}
export default routes;