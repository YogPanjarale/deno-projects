import { Application, Router } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";


const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "Hello World";
  }).get("/time",(context)=>{
    context.response.body=new Date().toLocaleTimeString("en-US",{timeZone:"Asia/Kolkata"});
  })
  
  

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

addEventListener("fetch", app.fetchEventHandler());