import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Heading,
} from "@shopify/polaris";

import trophyImgUrl from "../assets/home-trophy.png";

import { ProductsCard } from "./ProductsCard";
import Header from "./Header"
import HomeBody from './HomeBody'
export function HomePage() {
  return (
    <>
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <Header/>
        </Layout.Section>

        <Layout.Section>
          <HomeBody />
        </Layout.Section>
           
       
       
        {/* <Layout.Section secondary>
          <ProductsCard />
        </Layout.Section> */}
      </Layout>
    </Page>

    </>
  );
}
