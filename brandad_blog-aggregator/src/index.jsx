import ForgeUI, { render, Fragment, Text, Macro, useState, Table, Head, Row, Cell, Image, Button, useEffect } from '@forge/ui';

import { fetchBlogPosts, fetchBlogImage, fetchBlogSpace } from "./api-service";
import { spacesCache } from './storage';

const App = () => {

  const [_navStack, _updateNavStack] = useState({ stack: [`/wiki/api/v2/blogposts?sort=-created-date&limit=3`] });

  const [_nextLink, _updateNextLink] = useState();

  const loadBlog = async ([__navStack, __updateNavStack], back) => {
    const fetchedBlogs = await fetchBlogPosts([__navStack, __updateNavStack], back);
    if (fetchedBlogs.results.length > 0) {
      for (var i = 0; i < fetchedBlogs.results.length; i++) {
        await fetchBlogSpace(fetchedBlogs.results[i].spaceId);
        fetchedBlogs.results[i].__image = await fetchBlogImage(fetchedBlogs.results[i].id);
      }
    }

    _updateNextLink(fetchedBlogs._links.next);

    return fetchedBlogs;
  };

  const [blogs, updateBlogs] = useState(async () => {
    return await loadBlog([_navStack, _updateNavStack], false);
  });

  useEffect(async () => {
    if (_nextLink) {
      _updateNavStack({ stack: [..._navStack.stack, _nextLink + '&sort=-created-date'] });
    } else {
      _updateNavStack({ stack: [..._navStack.stack, `/wiki/api/v2/blogposts?sort=-created-date&limit=3`] });
    }
  }, [_nextLink]);

  const renderBlogPostTitles = (blogPosts) => {
    var blogPostElements = [];
    for (var i = 0; i < blogPosts.length; i++) {
      var post = blogPosts[i];
      blogPostElements.push(
        <Row>
          <Cell><Text>{spacesCache[post.spaceId]?.name ?? 'undefined'}</Text></Cell>
          <Cell><Text>{new Date(post.createdAt)?.toLocaleString('de-DE') ?? 'undefined'}</Text></Cell>
          <Cell><Text>{post.title}</Text></Cell>
          <Cell><Image alt="Bild" src={post.__image} /></Cell>
        </Row>);
    }
    return blogPostElements;
  };

  const renderButtons = (nextLink) => {
    var buttons = [];

    if (_navStack.stack.length > 2)
      buttons.push(
        <Button text='Vorherige Seite' onClick={async () => {
          updateBlogs(await loadBlog([_navStack, _updateNavStack], true));
        }}></Button>);

    buttons.push(
      <Button text={nextLink ? 'Nächste Seite' : 'Zum Anfang'} onClick={async () => {
        updateBlogs(await loadBlog([_navStack, _updateNavStack], false));
      }}></Button>);

    return buttons;
  }

  return (
    <Fragment>
      <Text>
        Number of blogposts in this conflunce instance: {blogs.results.length}
      </Text>
      <Table>
        <Head>
          <Cell><Text>Bereich</Text></Cell>
          <Cell><Text>Datum</Text></Cell>
          <Cell><Text>Titel</Text></Cell>
          <Cell><Text>Bild</Text></Cell>
        </Head>
        {renderBlogPostTitles(blogs.results)}
      </Table>

      {renderButtons(blogs._links.next)}

    </Fragment>
  );
};

export const run = render(
  <Macro
    app={<App />}
  />
);