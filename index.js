const app = require("express")();
const cors = require("cors");
app.use(cors());
const service = require("./service");

const initDb = require("./model/connection").initDb;

initDb(function (err) {
  const port = process.env.PORT || 3000;
  app.listen(port, (err) => {
    if (err) {
      throw err;
    }
    console.log(
      `${Date()}\nStarting development server at http://127.0.0.1:${port}\nQuit the server with CONTROL-C.`
    );
  });
});

app.get("/api/register/user", service.userRegistration);
app.get(
  "/api/page/visit/:user_id/:user_token/:page_id",
  service.uniquePageVisit
);
app.get("/api/website/visit/:page_id", service.websiteVisit);
app.get("/api/details/analytics", service.uniqueAnalytics);
app.get("/api/conditional/analytics", service.conditionalAnalytics);
