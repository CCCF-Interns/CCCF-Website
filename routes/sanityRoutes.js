import express from "express";
import client from "../utils/sanity.js";

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
      // expand markDefs (annotations, like links)
      markDefs[]{
        ...,
        _type == "link" => {
          _type,
          _key,
          href
        }
      },
      // expand images
      _type == "image" => {
        ...,
        asset->{
          _id,
          url,
          metadata {
            dimensions,
            lqip
          }
        }
      }
    }
  }`;
    try {
        const content = await client.fetch(QUERY);
        res.json(content);
    } catch (err) {
        res.status(500).json({ 
            error: "Failed to fetch content",
            reason: err
        });
    }
});

export default router;
