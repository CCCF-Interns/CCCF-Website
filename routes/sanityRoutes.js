import express from "express";
import client from "../utils/sanity.js";
import { toHTML } from "@portabletext/to-html";
import htm from "htm";
import vhtml from "vhtml";

const router = express.Router();

router.get("/api/blogs/:start/:end", async (req, res) => {
    const start = req.params.start;
    const end = req.params.end;
    const QUERY = `*[_type == "post"] | order(publishedAt desc) [${start}..${end}]{
    _id,
    title,
    "poster" : mainImage.asset->url,
    author-> {
      name,
      "image" : image.asset->url,
      bio
    },
    categories[]-> {
      title, 
      description
    },
    publishedAt
  }`;
    try {
        const blogs = await client.fetch(QUERY);
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ 
            error: "Failed to fetch content",
            reason: err
        });
    }
});

router.get("/api/blogs/total/", async (req, res) => {
  const QUERY = "count(*[_type == \"post\"])";

  try {
        const number = await client.fetch(QUERY);
        res.json({
          "number": number
        });
    } catch (err) {
        res.status(500).json({ 
            error: "Failed to fetch content",
            reason: err
        });
    }
});

router.get("/api/blog/:id", async (req, res) => {
    const id = req.params.id;
    const QUERY = `*[_type == "post" && _id == "${id}"]{
    title,
    "poster" : mainImage.asset->url,
    author-> {
      name,
      "image" : image.asset->url,
      bio
    },
    categories[]-> {
      title, 
      description
    },
    publishedAt,
    "body": body[]{
      ...,
      // if it's an image block, resolve the asset
      _type == "image" => {
        ...,
        asset->{
          _id,
          url,
          metadata { lqip, dimensions }
        }
      },
      // if it's a block with marks/annotations, expand them too
      markDefs[]{
        ...,
        _type == "link" => {
          ...,
          href
        }
      }
    }
  }`;
    let content;
    try {
        content = await client.fetch(QUERY);
    } catch (err) {
        return res.json({ 
            error: "No Content",
            reason: err
        });
    }

    const html = htm.bind(vhtml);

    const myPortableTextComponents = {
      types: {
        image: ({value}) => html`<img src="${value.asset.url}" />`,
      },
    };

    const htmlContent = toHTML(content[0].body, {
      components: myPortableTextComponents
    });

    res.json({
      details: content,
      content: htmlContent
    });
});

export default router;