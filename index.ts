import { AtpAgent } from "@atproto/api";
import * as dotenv from "dotenv";
import axios from "axios";
import { Filter } from "bad-words";
import type { NYTArticle } from "./interfaces.js";

dotenv.config();

const agent = new AtpAgent({
  service: "https://bsky.social",
});

const extraFilteredWords = process.env
  .EXTRA_FILTERED_WORDS!.split(",")
  .map((item) => item.trim());
const permittedWords = process.env
  .PERMITTED_WORDS!.split(",")
  .map((item) => item.trim());

const filter = new Filter();
filter.addWords(...extraFilteredWords);
filter.removeWords(...permittedWords);

async function main() {
  try {
    await agent.login({
      identifier: process.env.BSKY_HANDLE!,
      password: process.env.BSKY_PASSWORD!,
    });

    const oneHundredYearsAgo = new Date(
      new Date().setUTCFullYear(new Date().getUTCFullYear() - 100)
    )
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");
    const thatButTomorrow = new Date(
      Date.UTC(
        new Date().getUTCFullYear() - 100,
        new Date().getUTCMonth(),
        new Date().getUTCDate() + 1
      )
    )
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");

    const request = await axios.get(
      `https://api.nytimes.com/svc/search/v2/articlesearch.json?start_date=${oneHundredYearsAgo}&end_date=${thatButTomorrow}&api-key=${process
        .env.NYT_API_KEY!}`
    );

    const nytData: NYTArticle[] = request.data.response.docs;
    const headlinesArr: string[] = nytData
      .map((el) => el.headline.main)
      .filter((headline) => filter.isProfane(headline));

    if (headlinesArr.length === 0) {
      throw new Error("No headlines found");
    }

    const randomHeadline =
      headlinesArr[Math.floor(Math.random() * headlinesArr.length)];

    await agent.post({
      text: randomHeadline!,
      createdAt: new Date().toISOString(),
    });

    console.log("Post sent successfully!");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
