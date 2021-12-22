import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
//fs server side module. cant use in browser. https://github.com/vercel/next.js/discussions/12124#discussioncomment-6258
import Link from 'next/link';
import { sortByDate } from '../utils';
import Layout from '../components/Layout';
import Post from '../components/Post';

export default function HomePage({ posts }) {
  return (
    <Layout>
      <div className="px-1">
        <h2 className="text-5xl border-b-4 py-5 font-bold">Latest Posts</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 ">
          {posts.map((post, index) => (
            <Post key={index} post={post} />
          ))}
        </div>
      </div>
      <Link href="/blog">
        <a className="block text-center border border-gray-500 text-gray-800 py-4 m-6 transition duration-500 ease-in-out select-none  hover:text-white hover:bg-gray-900 focus:outline-none focus:shadow-xl">
          All Posts
        </a>
      </Link>
    </Layout>
  );
}

export async function getStaticProps() {
  //we are using sync to not have to use async/await
  const files = fs.readdirSync(path.join('posts'));

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

  return {
    props: { posts: posts.sort(sortByDate).slice(0, 6) },
  };
}
