import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import mime from 'mime';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req, res) => {
    const { image_url } = req.query;

    if(!image_url || image_url === ""){
      return res.status(400).send("Bad Request. Parameter: image_url is mandatory");
    }

    const result = await filterImageFromURL(image_url);
    const image = fs.readFileSync(result);  
    const mimeType = mime.getType(result);

    
    res.writeHead(200, 
      {'Content-Type': mimeType
    });

    res.write(image);
    res.end();
    deleteLocalFiles([result]);
    
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();