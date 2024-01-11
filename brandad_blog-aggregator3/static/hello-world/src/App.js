import React, { useEffect, useState } from 'react';

const alignmentArr = ["start", "center", "end"];

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
      <Stack alignBlock={alignmentArr[i % alignmentArr.length]} space="space.300">
        <Text >{post.title}</Text>
        <Inline grow="fill" space="space.100">
          <Stack space="space.200">
            <Image alt="Bild" src={post.__image} size="small" />
            <Text>{new Date(post.createdAt)?.toLocaleString('de-DE') ?? 'undefined'}</Text>
            <Text>{spacesCache[post.spaceId]?.name ?? 'undefined'}</Text>
            <Link href={blogPosts._links} openNewTab={true}>
              Gehe zum Blogpost von {spacesCache[post.spaceId]?.name ?? 'undefined'}
            </Link>
          </Stack>
        </Inline>
      </Stack>
    );
  }
  return blogPostElements;
};

function App() {
  cconst[blogs, setBlogs] = useState(undefined);

  useEffect(async () => {
    setBlogs(await loadBlog(undefined));
  }, []);

  return (
    <div>
      <Text>
        Number of blogposts in this confluence instance: {blogs?.results?.length}
      </Text>
      <Inline space="space.1000" spread="space-between">
        {renderBlogPostElements(blogs?.results ?? [])}
      </Inline>
    </div>
  );
}

export default App;
