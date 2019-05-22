var mysql = require("mysql"); // 调用MySQL模块
var feMenu = require('./feMenu.js');

class Agent {
  constructor(connection) {
    this.connection = connection;
    this.isConnect = false;

    this.connect = this.connect.bind(this);
    this.end = this.end.bind(this);
    this.select = this.select.bind(this);
  }
  connect() {
    const { isConnect } = this;
    const that = this;
    this.connection = mysql.createConnection(this.connection.config);
    const connection = this.connection;
    return new Promise(function(resolve, reject) {
      if (isConnect) {
        return resolve();
      } 
      connection.connect(function(err) {
        if (err) {
          return reject('[connect] - :' + err);
        }
        that.isConnect = true;
        resolve();
      });
    });
  }
  end() {
    const { connection, isConnect } = this;
    const that = this;
    return new Promise(function(resolve, reject) {
      if (!isConnect) {
        return resolve();
      }
      connection.end(function(err) {
        if (err) {
          return reject('[connect] - :' + err);
        }
        that.isConnect = false;
        resolve();
      });
    });
  }
  select(table, columns = '*') {
    const { connection } = this;
    return new Promise(function(resolve, reject) {
      connection.query(`select ${columns} from ${table}`, function(err, rows, fields) {
        if (err) {
          return reject('[select] - :' + err);
        }
        resolve({ data: rows, fields });
      });
    });
  }
  get(table, columns = '*') {
    const { connect, select, end } = this;
    return new Promise(function(resolve, reject) {
      const agentReject = err => reject(err);
      connect().then(() => {
        select(table, columns).then((data) => {
          resolve(data);
          end();
        }).catch(agentReject);
      }).catch(agentReject);
    });
  }
}
module.exports = {
  feMenu: new Agent(feMenu),
};
