import ForgeUI, { render, Fragment, Text, Macro, useState, Table, Head, Row, Cell, Image } from '@forge/ui';
 
import { fetchBlogPosts, fetchBlogImage, fetchBlogSpace } from "./api-service";
import { spacesCache } from './storage';
 
const App = () => {
 
  const [blogs] = useState(async () => {
    const fetchedBlogs = await fetchBlogPosts();
    if (fetchedBlogs.length > 0) {
      for(var i = 0; i < fetchedBlogs.length; i++) {
        await fetchBlogSpace(fetchedBlogs[i].spaceId);
        fetchedBlogs[i].__image = await fetchBlogImage(fetchedBlogs[i].id);
      }
    }
    return fetchedBlogs;
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
            <Cell><Image alt="Bild" src={post.__image}/></Cell>
        </Row>);
    }
    return blogPostElements;
  };
 
  return (
    <Fragment>
      <Text>
        Number of blogposts in this conflunce instance: {blogs.length}
      </Text>
      <Table>
        <Head>
          <Cell><Text>ID</Text></Cell>
          <Cell><Text>Bereich</Text></Cell>
          <Cell><Text>Datum</Text></Cell>
          <Cell><Text>Titel</Text></Cell>
          <Cell><Text>Bild</Text></Cell>
        </Head>
        {renderBlogPostTitles(blogs)}
      </Table>
    </Fragment>
    
  );
};
 
export const run = render(
  <Macro
    app={<App />}
  />
);