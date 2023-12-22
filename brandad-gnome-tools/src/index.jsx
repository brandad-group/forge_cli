import ForgeUI, { render, Fragment, Text, Macro, useState, useEffect } from "@forge/ui";
import api, { route } from "@forge/api";

const App = () => {
  const [pages, setPages] = useState([]);

  useEffect(async () => {
    const response = await api.asApp().requestConfluence(route('/wiki/rest/api/content?creator={username}&type=page', {
      username: '63f4cb943ec8aa51d3d1fec4',
    }));

    if (!response.ok) {
      const err = `Error while fetching pages: ${response.status} ${response.statusText}`;
      console.error(err);
      throw new Error(err);
    }

    const data = await response.json();
    setPages(data.results);
  }, []);

  return (
    <Fragment>
      {pages.map(page => (
        <Text>{page.title}</Text>
      ))}
    </Fragment>
  );
};

export const run = render(
  <Macro
    app={<App />}
  />
);