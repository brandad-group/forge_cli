import ForgeUI, { render, Fragment, Text, Macro, useState, Table, Head, Row, Cell, Image, Button } from '@forge/ui';

import { fetchBlogPosts, fetchBlogImage, fetchBlogSpace } from "./api-service";
import { spacesCache } from './storage';

const loadBlog = async (nextLink, back = false) => {
  const fetchedBlogs = await fetchBlogPosts(nextLink, back);
  if (fetchedBlogs.results.length > 0) {
    for (var i = 0; i < fetchedBlogs.results.length; i++) {
      await fetchBlogSpace(fetchedBlogs.results[i].spaceId);
      fetchedBlogs.results[i].__image = await fetchBlogImage(fetchedBlogs.results[i].id);
    }
  }
  return fetchedBlogs;
};

const App = () => {

  const [blogs, updateBlogs] = useState(async () => {
    return await loadBlog(undefined);
  });

  const renderBlogPostTitles = (blogPosts) => {
    var blogPostElements = [];
    for (var i = 0; i < blogPosts.length; i++) {
      var post = blogPosts[i];
      blogPostElements.push(
        <Row>
          <Cell><Text>{post.id}</Text></Cell>
          <Cell><Text>{spacesCache[post.spaceId]?.name ?? 'undefined'}</Text></Cell>
          <Cell><Text>{new Date(post.createdAt)?.toLocaleString('de-DE') ?? 'undefined'}</Text></Cell>
          <Cell><Text>{post.title}</Text></Cell>
          <Cell><Image alt="Bild" src={post.__image} /></Cell>
        </Row>);
    }
    return blogPostElements;
  };

  return (
    <Fragment>
      <Text>
        Number of blogposts in this conflunce instance: {blogs.results.length}
      </Text>
      <Table>
        <Head>
          <Cell><Text>ID</Text></Cell>
          <Cell><Text>Bereich</Text></Cell>
          <Cell><Text>Datum</Text></Cell>
          <Cell><Text>Titel</Text></Cell>
          <Cell><Text>Bild</Text></Cell>
        </Head>
        {renderBlogPostTitles(blogs.results)}
      </Table>

      <Button text='Vorher Seite' onClick={async () => {
        updateBlogs(await loadBlog(undefined, true))
      }}></Button>
      <Button text='Nächste Seite' onClick={async () => {
        updateBlogs(await loadBlog(blogs._links.next, false))
      }}></Button>
    </Fragment>
  );
};

export const run = render(
  <Macro
    app={<App />}
  />
);