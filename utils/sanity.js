import { createClient } from "@sanity/client";

const client = createClient({
    projectId: "gklaybzz",
    dataset: "production",
    apiVersion: "v2021-03-25",
    token: process.env.sanityToken,
    useCdn: true,
});

export default client;