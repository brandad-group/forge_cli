import Resolver from '@forge/resolver';
import {fetchBlogImage, fetchBlogPosts, fetchBlogSpace} from "./api-service";

const resolver = new Resolver();

const loadBlog = async (nextLink, back = false) => {
  const fetchedBlogs = await fetchBlogPosts(nextLink, back);
  /*
  if (fetchedBlogs.results.length > 0) {
    for (let i = 0; i < fetchedBlogs.results.length; i++) {
      await fetchBlogSpace(fetchedBlogs.results[i].spaceId);
      fetchedBlogs.results[i].__image = await fetchBlogImage(fetchedBlogs.results[i].id);
    }
  }
  */
  return fetchedBlogs;
};


resolver.define('getBlogs', async(req) => {
  console.log(req);

  return "await loadBlog(undefined)";
});

export const handler = resolver.getDefinitions();
