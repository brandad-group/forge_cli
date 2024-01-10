import React, { useEffect, useState } from 'react';
import ForgeReconciler, {Inline, Stack, Text, Image} from '@forge/react';
import {fetchBlogImage, fetchBlogPosts, fetchBlogSpace} from "./api-service";
import { spacesCache, navStack } from './storage';
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
        <Inline space="space.600">
          <Stack alignBlock={alignmentArr[i%3]} space="space.200">
            <Text>{post.title}</Text>
            <Inline grow="fill" space="space.100">
              <Image alt="Bild" src={post.__image} />
              <Stack space="space.100">
                <Text>{new Date(post.createdAt)?.toLocaleString('de-DE') ?? 'undefined'}</Text>
                <Text>{spacesCache[post.spaceId]?.name ?? 'undefined'}</Text>
              </Stack>
            </Inline>
          </Stack>
        </Inline>);
  }
  return blogPostElements;
};


const App = () => {
  const [blogs, setBlogs] = useState(undefined);

  useEffect(async () => {
    setBlogs(await loadBlog(undefined));
    }, []);

  return (
    <>
    <Text>
        Number of blogposts in this confluence instance: {blogs?.results?.length}
    </Text>
      {renderBlogPostElements(blogs?.results ??[])}
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
