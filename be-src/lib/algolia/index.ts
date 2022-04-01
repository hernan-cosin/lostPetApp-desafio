import algoliasearch from "algoliasearch";

const client = algoliasearch("XKXU80RKHF", process.env.algolia_api_key);
export const index = client.initIndex("pets");
