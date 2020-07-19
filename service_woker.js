const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

class UserMetaData {
  constructor(requestObject) {
    this.requestObject = requestObject;
  }
  _get_geolocation() {
    let ip =
      this.requestObject.headers["x-forwarded-for"] ||
      this.requestObject.connection.remoteAddress;
    const xmlHttp = new XMLHttpRequest();
    const theUrl = `https://ipapi.co/${ip}/json/`;
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    const raw_geolocation_response = xmlHttp.responseText;
    let geolocation_response;
    try {
      geolocation_response = JSON.parse(raw_geolocation_response);
      if (geolocation_response.error) {
        geolocation_response = false;
      }
    } catch (error) {
      geolocation_response = false;
    }
    return geolocation_response;
  }
  _get_os() {
    const userAgent = this.requestObject.headers["user-agent"];
    let OSName = "Others";
    if (userAgent.indexOf("Win") != -1) OSName = "Windows";
    if (userAgent.indexOf("Mac") != -1) OSName = "Macintosh";
    if (userAgent.indexOf("Linux") != -1) OSName = "Linux";
    if (userAgent.indexOf("Android") != -1) OSName = "Android";
    if (userAgent.indexOf("like Mac") != -1) OSName = "iOS";
    return OSName;
  }

  _generate_random_string() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
  perform_task_and_get_data() {
    let user_meta_data = {};
    const geolocation_response = this._get_geolocation();
    if (geolocation_response) {
      user_meta_data = {
        created_at: new Date(),
        user_token: this._generate_random_string(),
        ip: geolocation_response.ip,
        city: geolocation_response.city,
        state: geolocation_response.region,
        country: geolocation_response.country_name,
        operator: geolocation_response.org,
        os_name: this._get_os(),
        home_page: 0,
        introduction_page: 0,
        about_page: 0,
        contact_page: 0,
        analytics_dashboard_page: 0,
      };
    }
    return user_meta_data;
  }
}

class AverageUserPerMinute {
  constructor(data_list) {
    this.data_list = data_list;
  }
  _get_seconds(date_time) {
    let time_split_array = date_time.split('"')[1].split(":");
    return +time_split_array[time_split_array.length - 1].split(".")[0];
  }
  async _get_list_users_per_minute(datetime_sorted_list) {
    let users_per_minute = [];
    let users_count = 1;
    for (let i = 1; i < datetime_sorted_list.length; i++) {
      let current_second = this._get_seconds(datetime_sorted_list[i]);
      let previous_second = this._get_seconds(datetime_sorted_list[i - 1]);
      if (current_second < previous_second) {
        users_per_minute.push(users_count);
        users_count = 1;
      } else {
        users_count += 1;
      }
    }
    users_per_minute.push(users_count);
    return users_per_minute;
  }

  _data_sepration_by_page() {
    let pages_data = {
      home_page: [],
      introduction_page: [],
      about_page: [],
      contact_page: [],
      analytics_dashboard_page: [],
    };
    for (let data of this.data_list) {
      pages_data[data.page_name].push(JSON.stringify(data.created_at));
    }
    return pages_data;
  }

  async _average_user_count_data_on_page_per_minute() {
    let average_users_on_page_data = {};
    const pages_data = this._data_sepration_by_page();
    for (let page in pages_data) {
      const date_time_list = pages_data[page];
      const datetime_sorted_list = date_time_list.sort((a, b) => b - a);
      const users_per_minute = await this._get_list_users_per_minute(
        datetime_sorted_list
      );
      let sum = 0;
      for (let num of users_per_minute) {
        sum += num;
      }
      average_users_on_page_data[page] = Math.round(
        sum / users_per_minute.length
      );
    }
    return average_users_on_page_data;
  }

  _stringify_date_objects() {
    let date_time_list = this.data_list.map(function (data) {
      return JSON.stringify(data.created_at);
    });
    return date_time_list;
  }
  async _average_users_count_data_on_website_per_minute() {
    const date_time_list = this._stringify_date_objects();
    const datetime_sorted_list = date_time_list.sort((a, b) => b - a);
    const users_per_minute = await this._get_list_users_per_minute(
      datetime_sorted_list
    );
    let sum = 0;
    for (let num of users_per_minute) {
      sum += num;
    }
    return {
      average_users_on_website: Math.round(sum / users_per_minute.length),
    };
  }

  async perform_task_and_get_data() {
    const average_users_on_page_data = await this._average_user_count_data_on_page_per_minute();
    const average_users_on_website = await this._average_users_count_data_on_website_per_minute();
    return Object.assign(average_users_on_page_data, average_users_on_website);
  }
}

module.exports = { UserMetaData, AverageUserPerMinute };
