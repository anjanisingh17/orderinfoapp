// @ts-check
import { resolve } from "path";
import express from "express";
import cookieParser from "cookie-parser";
import nodemailer from "nodemailer";
import { Shopify, ApiVersion } from "@shopify/shopify-api";
import { LocalStorage } from "node-localstorage";
var localStorage = new LocalStorage("./scratch");
import "dotenv/config";
// var Router = require('./api/router').default;
import Router from "./api/router.js";
import conn from "./Database/conn.js";
import templates from "./Database/template.js";

import applyAuthMiddleware from "./middleware/auth.js";
import verifyRequest from "./middleware/verify-request.js";

const USE_ONLINE_TOKENS = true;
const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";

const PORT = parseInt(process.env.PORT || "8081", 10);
const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.April22,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// localStorage.setItem('Host', process.env.HOST)
// console.log(process.env.TEST)

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};
Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
  path: "/webhooks",
  webhookHandler: async (topic, shop, body) => {
    delete ACTIVE_SHOPIFY_SHOPS[shop];
  },
});

// export for test use only
export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production"
) {
  const app = express();
  app.set("top-level-oauth-cookie", TOP_LEVEL_OAUTH_COOKIE);
  app.set("active-shopify-shops", ACTIVE_SHOPIFY_SHOPS);
  app.set("use-online-tokens", USE_ONLINE_TOKENS);

  app.use(cookieParser(Shopify.Context.API_SECRET_KEY));

  applyAuthMiddleware(app);

  app.post("/webhooks", async (req, res) => {
    try {
      await Shopify.Webhooks.Registry.process(req, res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
      if (!res.headersSent) {
        res.status(500).send(error.message);
      }
    }
  });

  app.get("/products-count", verifyRequest(app), async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    const { Product } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );

    const countData = await Product.count({ session });
    res.status(200).send(countData);
  });

  app.post("/graphql", verifyRequest(app), async (req, res) => {
    try {
      const response = await Shopify.Utils.graphqlProxy(req, res);
      res.status(200).send(response.body);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.use(express.json());

  app.get("/getproduct", async (req, res) => {
    try {
      const client = new Shopify.Clients.Rest(
        localStorage.getItem("shop"),
        localStorage.getItem("accessToken")
      );
      const data = await client.get({
        path: "products",
      });
      res.status(200).json({ success: true, message: data.body.products });
    } catch (err) {
      res.send(err);
    }
  });

  app.use(Router);
  // console.log()

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "imran.techinfini@gmail.com",
      pass: "itaipvrnpzaabhuj",
    },
  });

  app.post("/webhooks/orders/create", async (req, res) => {
    res.status(200).end();
    // console.log(req.body)
    let order = req.body;
    let shipping_address = order.shipping_address;
    let location_city = shipping_address.city;
    let order_id = order.id;
    let username = shipping_address.first_name;

    const client = new Shopify.Clients.Rest(
      localStorage.getItem("shop"),
      localStorage.getItem("accessToken")
    );
    const data = await client.get({
      path: "shop",
    });

    let store_location = data.body.shop.city;

    templates.findOne({ shop: localStorage.getItem("shop") }, (err, result) => {
      if (err) {
        console.log("error", err);
      } else {
        let merchant = JSON.parse(result.merchant);
        let user = JSON.parse(result.user);
        var mailOptions = {};
        var mailOptions2 = {};
        if (location_city.toLowerCase() == store_location.toLowerCase()) {
          let sub = merchant.inside[0];
          let text = merchant.inside[1];

          let sub2 = user.inside[0];
          let text2 = user.inside[1];
          text2 = text2.replace("{name}", username);
          text2 = text2.replace("{orderno}", order_id);

          mailOptions = {
            from: "imran.techinfini@gmail.com",
            to: data.body.shop.email,
            subject: sub,
            text: text,
          };

          mailOptions2 = {
            from: "imran.techinfini@gmail.com",
            to: "imranul.haque@techinfini.in",
            subject: sub2,
            text: text2,
          };
        } else {
          let sub = merchant.remote[0];
          let text = merchant.remote[1];

          let sub2 = user.inside[0];
          let text2 = user.inside[1];

          text2 = text2.replace("{name}", username);
          text2 = text2.replace("{orderno}", order_id);

          mailOptions = {
            from: "imran.techinfini@gmail.com",
            to: data.body.shop.email,
            subject: sub,
            text: text,
          };
          mailOptions2 = {
            from: "imran.techinfini@gmail.com",
            to: "imranul.haque@techinfini.in",
            subject: sub2,
            text: text2,
          };
        }
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
            res.status(200).end();
          }
        });

        transporter.sendMail(mailOptions2, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
            res.status(200).end();
          }
        });
      }
    });
    // console.log(data.body.shop);
  });

  app.use((req, res, next) => {
    const shop = req.query.shop;
    if (Shopify.Context.IS_EMBEDDED_APP && shop) {
      res.setHeader(
        "Content-Security-Policy",
        `frame-ancestors https://${shop} https://admin.shopify.com;`
      );
    } else {
      res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
    }
    next();
  });

  app.use("/*", (req, res, next) => {
    const { shop } = req.query;

    // Detect whether we need to reinstall the app, any request from Shopify will
    // include a shop in the query parameters.
    if (app.get("active-shopify-shops")[shop] === undefined && shop) {
      res.redirect(`/auth?${new URLSearchParams(req.query).toString()}`);
    } else {
      next();
    }
  });

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;
  if (!isProd) {
    vite = await import("vite").then(({ createServer }) =>
      createServer({
        root,
        logLevel: isTest ? "error" : "info",
        server: {
          port: PORT,
          hmr: {
            protocol: "ws",
            host: "localhost",
            port: 64999,
            clientPort: 64999,
          },
          middlewareMode: "html",
        },
      })
    );
    app.use(vite.middlewares);
  } else {
    const compression = await import("compression").then(
      ({ default: fn }) => fn
    );
    const serveStatic = await import("serve-static").then(
      ({ default: fn }) => fn
    );
    const fs = await import("fs");
    app.use(compression());
    app.use(serveStatic(resolve("dist/client")));
    app.use("/*", (req, res, next) => {
      // Client-side routing will pick up on the correct route to render, so we always render the index here
      res
        .status(200)
        .set("Content-Type", "text/html")
        .send(fs.readFileSync(`${process.cwd()}/dist/client/index.html`));
    });
  }

  return { app, vite };
}

if (!isTest) {
  createServer().then(({ app }) => app.listen(PORT));
}
