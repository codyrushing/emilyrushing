const nodeStatic = require("node-static");
const port = 3001;
const paths = require("./paths");
const fileServer = new nodeStatic.Server(paths.distBase);

require("http").createServer(function (request, response) {
  var url = request.url;

  // force www
  if (request.headers.host === "emily-rushing.com") {
   response.statusCode = 302;
   response.setHeader("Location", "www."+url);
  }

  request.addListener("end", function () {
    fileServer.serve(request, response);
  }).resume();
  
}).listen(port, (err) => {
  if (err) throw err;
  console.log(
`
* * * * * * * * * * * * * * * * * * * * * * * *
* Local server is up and running on port ${port} *
* * * * * * * * * * * * * * * * * * * * * * * *
`
  );
});
