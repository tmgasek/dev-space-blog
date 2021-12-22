import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
//fs server side module. cant use in browser. https://github.com/vercel/next.js/discussions/12124#discussioncomment-6258
import Link from 'next/link';
import { sortByDate } from '../../../utils';
import Layout from '../../../components/Layout';
import Post from '../../../components/Post';
import { POSTS_PER_PAGE } from '../../../config';
import Pagination from '../../../components/Pagination';

export default function BlogPage({ posts, numPages, currentPage }) {
  return (
    <Layout>
      <div className="px-1">
        <h2 className="text-5xl border-b-4 py-5 font-bold">Blog</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 ">
          {posts.map((post, index) => (
            <Post key={index} post={post} />
          ))}
        </div>
        <Pagination currentPage={currentPage} numPages={numPages} />
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join('posts'));

  const numPages = Math.ceil(files.length / POSTS_PER_PAGE);

  let paths = [];

  for (let i = 1; i <= numPages; i++) {
    paths.push({
      params: { page_index: i.toString() },
    });
  }

  console.log(paths);
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
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

  const page = parseInt((params && params.page_index) || 1);

  const numPages = Math.ceil(files.length / POSTS_PER_PAGE);
  const pageIndex = page - 1;
  const orderedPosts = posts
    .sort(sortByDate)
    .slice(pageIndex * POSTS_PER_PAGE, (pageIndex + 1) * POSTS_PER_PAGE);

  return {
    props: {
      posts: orderedPosts,
      numPages,
      currentPage: page,
    },
  };
}
