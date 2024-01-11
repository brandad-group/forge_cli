import React, { useEffect, useState } from 'react';

import { fetchBlogPosts, fetchBlogSpace, fetchBlogImage } from './api-service';
import { spacesCache } from './storage';

const loadBlog = async (nextLink, back = false) => {
  const fetchedBlogs = await fetchBlogPosts(nextLink, back);
  if (fetchedBlogs.results.length > 0) {
    for (let i = 0; i < fetchedBlogs.results.length; i++) {
      await fetchBlogSpace(fetchedBlogs.results[i].spaceId);
      fetchedBlogs.results[i].__image = await fetchBlogImage(fetchedBlogs.results[i].id);
    }
  }

  return fetchedBlogs;
};

const renderBlogPostElements = (blogPosts) => {
  let blogPostElements = [];
  for (let i = 0; i < blogPosts.length; i++) {
    let post = blogPosts[i];
    blogPostElements.push(
      <div class="blog-container">
        <h2 class="blog-title">{post.title}</h2>
        <div class="blog-image-container">
          <img class="blog-image" alt="Bild" src={post.__image} />
        </div>
        <span>{new Date(post.createdAt)?.toLocaleString('de-DE') ?? 'undefined'}</span>
        <span class="blog-space-name">{spacesCache[post.spaceId]?.name ?? 'undefined'}</span>
        <a class="blog-link" href={'/wiki' + post._links.webui} target='_blank'>Gehe zum Post</a>
      </div>
    );
  }
  return blogPostElements;
};

function App() {
  const [blogs, setBlogs] = useState(undefined);

  useEffect(async () => {
    setBlogs(await loadBlog(undefined));
  }, []);

  return (
    <div class="text-light">
      Number of blogposts in this confluence instance: {blogs?.results?.length}
      <div class="blog-grid">
        {renderBlogPostElements(blogs?.results ?? [])}
      </div>
    </div>
  );
}

export default App;
