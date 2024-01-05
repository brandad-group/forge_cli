import api, { route } from "@forge/api";
import ForgeUI, { render, Fragment, Text, Macro, useState, Table, Head, Row, Cell } from '@forge/ui';
 
const spacesCache = [];

const fetchBlogPosts = async () => {
  const res = await api
    .asUser()
    .requestConfluence(route`/wiki/api/v2/blogposts?sort=-created-date&limit=10`, {
      headers: {
        'Accept': 'application/json'
      }
    });
 
  const data = await res.json();
  return data.results;
};
 
const fetchBlogSpace = async (spaceId) => {

  if(spacesCache[spaceId])
    return spacesCache[spaceId];

  const res = await api
    .asUser()
    .requestConfluence(route`/wiki/api/v2/spaces/${spaceId}`, {
      headers: {
        'Accept': 'application/json'
      }
    });
 
  const data = await res.json();

  spacesCache[spaceId] = data;

  return data;
};
 
const App = () => {
 
  const [blogs] = useState(async () => {
    const fetchedBlogs = await fetchBlogPosts();
    if (fetchedBlogs.length > 0) {
      for(var i = 0; i < fetchedBlogs.length; i++)
        await fetchBlogSpace(fetchedBlogs[i].spaceId);
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
            <Cell><Text>{spacesCache[post.spaceId].name}</Text></Cell>
            <Cell><Text>{new Date(post.createdAt).toLocaleString()}</Text></Cell>
            <Cell><Text>{post.title}</Text></Cell>
        </Row>);
    }
    return blogPostElements;
  };
 
  return (
    <Fragment>
      <Text>Hello world!</Text>
      <Text>Hello BRANDAD!</Text>
      <Text>Hello API-Call-Test! 5</Text>
      {/* <Text>
        Number of comments on this page: {comments.length}
      </Text> */}
      <Text>
        Number of blogposts in this conflunce instance: {blogs.length}
      </Text>
      <Table>
        <Head>
          <Cell><Text>ID</Text></Cell>
          <Cell><Text>Bereich</Text></Cell>
          <Cell><Text>Datum</Text></Cell>
          <Cell><Text>Titel</Text></Cell>
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