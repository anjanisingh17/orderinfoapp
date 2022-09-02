import {
  Card,
  Tabs,
  Page,
  Layout,
  Button,
  Heading,
  Modal,
  Stack,
  DataTable,
  Link,
} from "@shopify/polaris";

import Merchant from "./Merchant";
import Usertemp from "./Usertemp";

import { useState, useCallback, useEffect } from "react";

const tabs = [
  {
    id: "all-customers-1",
    content: "Merchant Template",
    accessibilityLabel: "All customers",
    panelID: "all-customers-content-1",
    Mycontent: <Merchant />,
  },
  {
    id: "accepts-marketing-1",
    content: "User Template",
    panelID: "accepts-marketing-content-1",
    Mycontent: <Usertemp />,
  },
];
let shop = new URL(location.href).searchParams.get("shop");
console.log(location.href);
export function HomePage() {
  const [selected, setSelected] = useState(0);
  const [active, setActive] = useState(false);
  const [data, setdata] = useState([]);

  const toggleActive = () => {
    if (active == false) {
      setActive(true);
    } else {
      setActive(false);
    }
  };

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  useEffect(() => {
    get_product();
  }, []);

  const get_product = async () => {
    let response = await fetch("/getproduct");
    let data = await response.json();
    // let dummy_data = [];
    let row_data = data.message.reduce((prev, item) => {
      let arr = [
        <Link
          removeUnderline
          url={"https://" + shop + "/admin/products/" + item.id}
          key={item.title}
          external
        >
          {item.title}
        </Link>,
        item.variants[0].price,
        item.vendor,
        item.variants[0].inventory_quantity,
      ];
      prev.push(arr);
      return prev;
    }, []);
    setdata(row_data);
    // console.log('row_data>>>',row_data)
  };

  const exportcsv = () => {
    // (B) ARRAY TO CSV STRING
    var csv = "";
    csv =
      "Product" +
      "," +
      "Price" +
      "," +
      "Vendor" +
      "," +
      "Net quantity" +
      "," +
      "\r\n";

    for (let row of data) {
      for (let col in row) {
        if (col == 0) {
          csv += row[0].key + ",";
        } else {
          csv += row[col] + ",";
        }
      }
      csv += "\r\n";
    }
    // (C) CREATE BLOB OBJECT
    var myBlob = new Blob([csv], { type: "text/csv" });

    // (D) CREATE DOWNLOAD LINK
    var url = window.URL.createObjectURL(myBlob);
    var anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "product.csv";
    anchor.click();
    window.URL.revokeObjectURL(url);
    anchor.remove();
  };

  return (
    <Page fullWidth>
      <Modal large open={active} onClose={toggleActive} title="Product List">
        <Modal.Section>
          <Stack vertical>
            <Button onClick={exportcsv}>Export CSV</Button>
            <Card>
              <DataTable
                columnContentTypes={["text", "numeric", "text", "numeric"]}
                headings={["Product", "Price", "Vendor", "Net quantity"]}
                rows={data}
              />
            </Card>
          </Stack>
        </Modal.Section>
      </Modal>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Button primary onClick={toggleActive}>
              Product List
            </Button>{" "}
            <br />
            <center>
              <Heading>Email Template</Heading>
            </center>
            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
              <Card.Section title={tabs[selected].Mycontent}></Card.Section>
            </Tabs>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
