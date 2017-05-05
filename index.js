import app from "./lib/app";
import http from "http";
import rs from "./lib/rs";

const httpServer = http.createServer(app);
rs.attach(httpServer);
httpServer.listen(8080, () => {
    console.log("sap-traffic-pilot server is now running at 8080.");
});
