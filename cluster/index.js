var app = require("./app");

app.set("port", process.env.PORT);

console.log('server is running');
app.listen(process.env.PORT);
