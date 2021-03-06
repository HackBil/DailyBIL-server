// node_env can either be "development", "production" or "test"
var node_env = process.env.NODE_ENV || "development";

// Port to run the app on. 8000 for development
// 80 for production
var default_port = 8000;
var port = process.env.PORT || default_port;


// MongoDB configuration
var mongo = process.env.MONGO_URL || ("mongodb://localhost/" + "dailybil-" + node_env);

module.exports = {
  mongoUrl: mongo,
  port: port,
};
