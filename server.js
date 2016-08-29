const nodeStatic = require("node-static");
const port = 3001;
const paths = require("./paths");
const fileServer = new nodeStatic.Server(paths.distBase);

require("http").createServer(function (request, response) {
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
