import api, { route } from "@forge/api";
import ForgeUI, { render, Fragment, Text, Macro, useProductContext, useState, Table, Head, Row, Cell } from '@forge/ui';
 
const fetchCommentsForContent = async (contentId) => {
  const res = await api
    .asUser()
    .requestConfluence(route`/wiki/rest/api/content/${contentId}/child/comment`);
 
  const data = await res.json();
  return data.results;
};
 
const fetchBlogPosts = async () => {
  const res = await api
    .asUser()
    .requestConfluence(route`/wiki/rest/api/content?type=blogpost`);
 
  const data = await res.json();
  return data.results;
};
 
const fetchBlogPostHistory = async (blogPostId) => {
  const res = await api
    .asUser()
    .requestConfluence(route`/wiki/rest/api/content/${blogPostId}/history`);
 
  const data = await res.json();
  return data.results;
};
 
const App = () => {
  const context = useProductContext();
  const [comments] = useState(async () => await fetchCommentsForContent(context.contentId));
  console.log(`Number of comments on this page: ${comments.length}`);
 
  const [blogs] = useState(async () => {
    const fetchedBlogs = await fetchBlogPosts();
    if (fetchedBlogs.length > 0) {
      const history = await fetchBlogPostHistory(fetchedBlogs[0].id);
      if (history && history.length > 0) {
        console.log(history[0]); // Log the first history record of the first blog post
      }
    }
    return fetchedBlogs;
  });
 
  const renderBlogPostTitles = (blogPosts) => {
    var blogPostElements = [];
    for (var i = 0; i < blogPosts.length; i++) {
      var post = blogPosts[i];
      if (i == 6) console.log(JSON.stringify(post)); // Log the current post as JSON
 
      blogPostElements.push(
        <Row>
            <Cell><Text>{post.id}</Text></Cell>
            <Cell><Text>{post._expandable.space}</Text></Cell>
            <Cell><Text>DATUM</Text></Cell>
            <Cell><Text>{post.title}</Text></Cell>
        </Row>);
    }
    return blogPostElements;
    //return blogPosts.map((post) => <Text key={post.id}>{post.title}</Text>);
  };
 
  return (
    <Fragment>
      <Text>Hello world!</Text>
      <Text>Hello BRANDAD!</Text>
      <Text>Hello API-Call-Test! 77777</Text>
      <Text>
        Number of comments on this page: {comments.length}
      </Text>
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