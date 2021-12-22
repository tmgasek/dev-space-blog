import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { sortByDate } from '@/utils/index';
//fs server side module. cant use in browser. https://github.com/vercel/next.js/discussions/12124#discussioncomment-6258

const files = fs.readdirSync(path.join('posts'));

export function getPosts() {
  const posts = files.map((filename) => {
    const slug = filename.replace('.md', '');

    const markdownWithMeta = fs.readFileSync(
      path.join('posts', filename),
      'utf-8'
    );

    //we destructure the data, save it as const and rename it to frontmatter
    const { data: frontmatter } = matter(markdownWithMeta);

    return {
      slug, //slug: slug
      frontmatter,
    };
  });

  return posts.sort(sortByDate);
}
