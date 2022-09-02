import React, { useState, useCallback, useEffect } from "react";
import {
  Toast,
  Frame,
  FormLayout,
  TextField,
  Select,
  Button,
  Heading,
  Spinner,
} from "@shopify/polaris";
// import dotenv from 'dotenv';
// dotenv.config();
// import "dotenv/config";

const Merchant = () => {
  const [selected, setSelected] = useState("inside");
  const [userLogin, setUserLogin] = useState({ title: "", msg: "" });
  const [active, setActive] = useState(false);
  const [spiner, setSpiner] = useState(false);

  let baseurl = window.location.origin;
  let shop = new URL(location.href).searchParams.get("shop");

  const toggleActive = () => {
    console.log("closed successfully!");
    setActive(false);
  };

  const handleInput = (e, name) => {
    let value = e;
    setUserLogin({ ...userLogin, [name]: value });
  };

  let arr = ["title", "msg"];

  const [predata, setPredata] = useState(null);
  const handleSelectChange = useCallback((value) => setSelected(value), []);

  const options = [
    { label: "Inside", value: "inside" },
    { label: "Remote", value: "remote" },
  ];

  useEffect(() => {
    get_data(selected);
  }, [selected]);

  const get_data = async (selected) => {
    let response = await fetch(`${baseurl}/api/template/${shop}`);
    let data = await response.json();

    setPredata(data.message);

    if (data.message) {
      let res = JSON.parse(data.message.merchant);
      if (selected == "inside") {
        let title = res.inside[0];
        let msg = res.inside[1];
        arr.map((item) => {
          if (item == "title") {
            setUserLogin({ ...userLogin, [item]: title });
          } else {
            setUserLogin({ ...userLogin, [item]: msg });
          }
        });
        // setUserLogin({ ...userLogin, ['msg']: msg });
      } else {
        let title = res.remote[0];
        let msg = res.remote[1];
        // setUserLogin({ ...userLogin, ['title']: title });
        // setUserLogin({ ...userLogin, ['msg']: msg });
        arr.map((item) => {
          if (item == "title") {
            setUserLogin({ ...userLogin, [item]: title });
          } else {
            setUserLogin({ ...userLogin, [item]: msg });
          }
        });
      }
    }
  };

  const save = async () => {
    setSpiner(true);
    if (predata == null) {
      if (selected == "inside") {
        var Merchant = {
          inside: [userLogin.title, userLogin.msg],
          remote: ["", ""],
        };
      } else {
        var Merchant = {
          inside: ["", ""],
          remote: [userLogin.title, userLogin.msg],
        };
      }
      let merchant_json = JSON.stringify(Merchant);
      let user_json = JSON.stringify({});
      let data = { shop: shop, merchant: merchant_json, user: user_json };

      let response = await fetch(`${baseurl}/api/template`, {
        method: "post",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      let result = await response.json();
      if (result.success) {
        // alert('templates save successfully!');
        setSpiner(false);
        setActive(true);
      } else {
        alert("something went wrong!");
      }
    } else {
      if (selected == "inside") {
        let inside = JSON.parse(predata.merchant);
        let title = inside.remote[0];
        let msg = inside.remote[1];
        var Merchant = {
          inside: [userLogin.title, userLogin.msg],
          remote: [title, msg],
        };
      } else {
        let outside = JSON.parse(predata.merchant);
        let title = outside.inside[0];
        let msg = outside.inside[1];
        var Merchant = {
          inside: [title, msg],
          remote: [userLogin.title, userLogin.msg],
        };
      }
      let merchant_json = JSON.stringify(Merchant);
      let data = { shop: shop, merchant: merchant_json, user: predata.user };

      let response = await fetch(`${baseurl}/api/template/${predata._id}`, {
        method: "PATCH",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      let result = await response.json();

      if (result.success) {
        setSpiner(false);
        setActive(true);
      } else {
        alert("something went wrong!");
      }
    }
  };

  return (
    <div>
      <Frame>
        <center>
          <Heading>Merchant Template</Heading>
          {spiner ? (
            <Spinner accessibilityLabel="Spinner example" size="large" />
          ) : null}
          <div id="test"></div>
        </center>
        <FormLayout>
          <TextField
            type="text"
            label="Title"
            onChange={(e) => handleInput(e, "title")}
            name="title"
            value={userLogin.title}
            placeholder="Enter Title"
          />
          <TextField
            type="text"
            label="Enter Description"
            onChange={(e) => handleInput(e, "msg")}
            name="msg"
            multiline={4}
            value={userLogin.msg}
            placeholder="Enter Description"
          />

          <Select
            label="Select Option"
            options={options}
            onChange={handleSelectChange}
            value={selected}
            style={{ marginTop: "5px" }}
          />

          <Button onClick={save} style={{ marginTop: "5px" }} primary>
            Save Template
          </Button>
        </FormLayout>
        {active ? (
          <Toast
            content="Template Save"
            duration="3000"
            onDismiss={toggleActive}
          />
        ) : null}
      </Frame>
    </div>
  );
};

export default Merchant;

// https://app.tpop.com/webhook2?shop=sntosh-test-store.myshopify.com
