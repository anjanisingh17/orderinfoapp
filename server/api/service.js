import templates from "../Database/template.js";

const create = (data, callback) => {
  let template = new templates(data);
  template.save((err, result) => {
    if (err) {
      return callback(null, err);
    } else {
      return callback(null, result);
    }
  });
};
const gettemp = (shop, callback) => {
  templates.findOne({ shop: shop }, (err, result) => {
    if (err) {
      return callback(null, err);
    } else {
      return callback(null, result);
    }
  });
};

const updatebyid = (data, callback) => {
  templates.findByIdAndUpdate(data.id, data, (err, result) => {
    if (err) {
      return callback(null, err);
    } else {
      return callback(null, result);
    }
  });
};
export default { create, gettemp, updatebyid };
