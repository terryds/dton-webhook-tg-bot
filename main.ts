import { webhookCallback } from "https://deno.land/x/grammy@v1.32.0/mod.ts";
// You might modify this to the correct way to import your `Bot` object.
import { bot } from "./bot.ts";

const handleUpdate = webhookCallback(bot, "std/http");

Deno.serve(async (req) => {
  if (req.method === "POST") {
    console.log("get post request")
    const url = new URL(req.url);
    console.log(req.url)
    if (url.pathname.slice(1) === Deno.env.get("BOT_TOKEN")) {
      try {
        console.log(req)
        return await handleUpdate(req);
      } catch (err) {
        console.error(err);
      }
    }
    else if (url.pathname.slice(1) === "notify") {
      console.log("notify")
      try {
        console.log(req)
        console.log("reading body")
        console.log(req.body)
        console.log("sending message")
        await bot.api.sendMessage(Deno.env.get("TELEGRAM_CHANNEL"), "Hi!")
        return new Response();
      } catch (err) {
        console.error(err);
      }
      
    }
  }
  return new Response();
});