import { getPosts } from '@/lib/posts';

export default (req, res) => {
  const query = req.query.q.toLowerCase();
  let posts;

  if (process.env.NODE_ENV === 'production') {
    // Fetch from cache
    posts = require('../../cache/data').posts;
  } else {
    posts = getPosts();
  }

  const results = posts.filter(
    ({ frontmatter: { title, excerpt, category } }) =>
      title.toLowerCase().indexOf(query) != -1 ||
      excerpt.toLowerCase().indexOf(query) != -1 ||
      category.toLowerCase().indexOf(query) != -1
  );

  res.status(200).json(JSON.stringify({ results }));
};
