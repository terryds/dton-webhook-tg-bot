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
        const body = await req.json();
        console.log(body)
        console.log("sending message")
        const sliced = body.data.transactions.slice(0, 1);
        const firstOne = sliced[0];
        const message = `🥳New incoming message!\n\nTime: ${firstOne.now}\nFrom: ${firstOne.in_msg_src_addr_address_hex__friendly}\nAmount: ${firstOne.in_msg_value_grams}\nComment: ${firstOne.in_msg_comment}\n\nSee on DTon Explorer: https://dton.io/tx/${firstOne.hash}`;
        await bot.api.sendMessage(Deno.env.get("TELEGRAM_CHANNEL"), message)
        return new Response();
      } catch (err) {
        console.error(err);
      }
      
    }
  }
  return new Response();
});