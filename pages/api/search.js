// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getPosts } from '@/lib/posts';

export default function helloAPI(req, res) {
  const query = req.query.q.toLowerCase();
  let posts;

  if (process.env.NODE_ENV === 'production') {
    //TODO: fetch from cache
  } else {
    //   const files = fs.readdirSync(path.join('posts'));
    //   posts = files.map((filename) => {
    //     const markdownWithMeta = fs.readFileSync(
    //       path.join('posts', filename),
    //       'utf-8'
    //     );
    //     const { data: frontmatter } = matter(markdownWithMeta);
    //     return {
    //       frontmatter,
    //     };
    //   });
    posts = getPosts();
  }

  const results = posts.filter(
    ({ frontmatter: { title, excerpt, category } }) =>
      title.toLowerCase().indexOf(query) != -1 ||
      excerpt.toLowerCase().indexOf(query) != -1 ||
      category.toLowerCase().indexOf(query) != -1
  );

  res.status(200).json(JSON.stringify({ results }));
}
