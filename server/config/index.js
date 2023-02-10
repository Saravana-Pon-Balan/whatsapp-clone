import bodyParser from "body-parser";
import compression from "compression";
import cors from 'cors';

const configureExpressApp = (app) =>{
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    app.use(compression(9));
    app.use(cors());
    
};

export default configureExpressApp;
