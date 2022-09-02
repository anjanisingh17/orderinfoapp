import getcontrolle from "./service.js";

const create_temp = (req, res) => {
  let body = req.body;
  getcontrolle.create(body, (err, result) => {
    if (err) {
      res.status(400).json({ success: false, message: result });
    } else {
      res.status(200).json({ success: true, message: result });
    }
  });
};
const get_temp = (req, res) => {
  let shop = req.params.shop;
  getcontrolle.gettemp(shop, (err, result) => {
    if (err) {
      res.status(400).json({ success: false, message: err });
    } else {
      if (!result) {
        res.status(400).json({ success: false, message: result });
      } else {
        res.status(200).json({ success: true, message: result });
      }
    }
  });
};

const update = (req, res) => {
  let id = req.params.id;
  let body = req.body;
  body.id = id;
  getcontrolle.updatebyid(body, (err, result) => {
    if (err) {
      res.status(400).json({ success: false, message: err });
    } else {
      if (!result) {
        res.status(400).json({ success: false, message: result });
      } else {
        res.status(200).json({ success: true, message: result });
      }
    }
  });
};

export default { create_temp, get_temp, update };
