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

const Usertemp = () => {
  const [selected, setSelected] = useState("inside");
  const [userLogin, setUserLogin] = useState({ title: "", msg: "" });
  const [active, setActive] = useState(false);
  const [spiner, setSpiner] = useState(false);

  let baseurl = window.location.origin;
  let shop = new URL(location.href).searchParams.get("shop");

  const handleInput = (e, name) => {
    let value = e;
    setUserLogin({ ...userLogin, [name]: value });
  };

  const toggleActive = () => {
    console.log("closed successfully!");
    setActive(false);
  };

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
    // console.log(selected)

    let response = await fetch(`${baseurl}/api/template/${shop}`);
    let data = await response.json();
    console.log("data>>", data);
    setPredata(data.message);
    if (data.message) {
      let res = JSON.parse(data.message.user);
      if (res) {
        if (selected == "inside") {
          let title = res.inside[0];
          let msg = res.inside[1];
          setUserLogin({ ...userLogin, ["title"]: title });
          setUserLogin({ ...userLogin, ["msg"]: msg });
        } else {
          let title = res.remote[0];
          let msg = res.remote[1];
          setUserLogin({ ...userLogin, ["title"]: title });
          setUserLogin({ ...userLogin, ["msg"]: msg });
        }

        // console.log('title>>', title)
      }
    }
  };

  // console.log(JSON.stringify(User))

  const save = async () => {
    setSpiner(true);
    if (predata == null) {
      if (selected == "inside") {
        var user = {
          inside: [userLogin.title, userLogin.msg],
          remote: ["", ""],
        };
      } else {
        var user = {
          inside: ["", ""],
          remote: [userLogin.title, userLogin.msg],
        };
      }
      let user_json = JSON.stringify(user);
      let merchant_json = JSON.stringify({});
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
        setSpiner(false);

        setActive(true);
      } else {
        alert("something went wrong!");
      }
    } else {
      let title = "";
      let msg = "";

      if (selected == "inside") {
        let inside = JSON.parse(predata.user);
        if (inside.remote != undefined) {
          title = inside.remote[0];
          msg = inside.remote[1];
        }

        var user = {
          inside: [userLogin.title, userLogin.msg],
          remote: [title, msg],
        };
      } else {
        let outside = JSON.parse(predata.merchant);
        if (outside.inside != undefined) {
          title = outside.inside[0];
          msg = outside.inside[1];
        }

        var user = {
          inside: [title, msg],
          remote: [userLogin.title, userLogin.msg],
        };
      }
      let user_json = JSON.stringify(user);

      let response = await fetch(`${baseurl}/api/template/${predata._id}`, {
        method: "PATCH",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: user_json }),
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
          <Heading>User Template</Heading>
          {spiner ? (
            <Spinner accessibilityLabel="Spinner example" size="large" />
          ) : null}
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
        </FormLayout>
        <br />
        <Select
          label="Select Option"
          options={options}
          onChange={handleSelectChange}
          value={selected}
          style={{ marginTop: "5px" }}
        />
        <br />
        <Button onClick={save} style={{ marginTop: "5px" }} primary>
          Save Template
        </Button>
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

export default Usertemp;
