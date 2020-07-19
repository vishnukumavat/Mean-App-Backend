const ObjectId = require("mongodb").ObjectID;
const DataBaseOperations = require("./model/models").DataBaseOperations;
const AverageUserPerMinute = require("./service_woker").AverageUserPerMinute;
const UserMetaData = require("./service_woker").UserMetaData;

const collection_unique_global_visitor = "unique_global_visitors";
const collection_website_visits = "website_visits";
const page_name_id_mapping = {
  1: "home_page",
  2: "introduction_page",
  3: "about_page",
  4: "contact_page",
  5: "analytics_dashboard_page",
};

exports.userRegistration = (req, res) => {
  const user_meta_data = new UserMetaData(req).perform_task_and_get_data();
  const dbOpsObj = new DataBaseOperations();
  const result = dbOpsObj.insertDocument(
    collection_unique_global_visitor,
    user_meta_data
  );
  result.then(function (result) {
    res.send({
      user_id: result.insertedId,
      user_token: result.ops[0].user_token,
    });
  });
};

exports.uniquePageVisit = (req, res) => {
  if (page_name_id_mapping[req.params.page_id]) {
    const query = {
      _id: ObjectId(req.params.user_id),
      user_token: req.params.user_token,
    };
    const updated_object = {};
    updated_object[page_name_id_mapping[req.params.page_id]] = 1;
    const update_query = {
      $set: updated_object,
    };
    const dbOpsObj = new DataBaseOperations();
    dbOpsObj.updateDocument(
      collection_unique_global_visitor,
      query,
      update_query
    );
  }
  res.send({});
};

exports.websiteVisit = (req, res) => {
  if (page_name_id_mapping[req.params.page_id]) {
    const dbOpsObj = new DataBaseOperations();
    const insertion_object = {
      page_name: page_name_id_mapping[req.params.page_id],
      created_at: new Date(),
    };
    dbOpsObj.insertDocument(collection_website_visits, insertion_object);
  }
  res.send({});
};

exports.uniqueAnalytics = async (req, res) => {
  const dbOpsObj = new DataBaseOperations();
  const return_object = {};
  const group_by_keys = ["city", "state", "country", "operator", "os_name"];
  const group_by_page_keys = [
    "home_page",
    "introduction_page",
    "about_page",
    "contact_page",
    "analytics_dashboard_page",
  ];
  for (let key of group_by_keys) {
    let result = await dbOpsObj.aggregatedDocumentResult(
      collection_unique_global_visitor,
      key
    );
    return_object[key] = result[0];
  }
  for (let key of group_by_page_keys) {
    const query = {};
    query[key] = 1;
    let result = [];
    result = await dbOpsObj.getDocumentByQuery(
      collection_unique_global_visitor,
      query
    );
    return_object[key] = { count: result.length };
  }
  const visited_users_on_website = await dbOpsObj.getAllDocument(
    collection_unique_global_visitor
  );
  return_object["visited_users_on_website"] = visited_users_on_website.length;
  res.send(return_object);
};

exports.conditionalAnalytics = async (req, res) => {
  const dbOpsObj = new DataBaseOperations();
  let result = await dbOpsObj.getAllDocument(collection_website_visits);
  const average_users_per_minute = await new AverageUserPerMinute(
    result
  ).perform_task_and_get_data();
  res.send({ average: average_users_per_minute });
};
