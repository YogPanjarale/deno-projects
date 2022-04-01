import { Application, Router } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";


const hits = {
  times : 0,
  lastTime : "",
}
const router = new Router();
router
  .get("/time",(context)=>{
    context.response.body=new Date().toLocaleTimeString("en-US",{timeZone:"Asia/Kolkata"});
  })

const app = new Application();

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());
app.use((context) => { 
  hits.times++;
  hits.lastTime = new Date().toLocaleTimeString("en-US",{timeZone:"Asia/Kolkata"});
  hits.times++;
  hits.lastTime=new Date().toLocaleTimeString("en-US",{timeZone:"Asia/Kolkata"});
  context.response.body=`${hits.times} times hit. Last hit at ${hits.lastTime}`;
})
app.listen({ port: 8000 });