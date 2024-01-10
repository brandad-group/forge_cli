import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text } from '@forge/react';
import { invoke } from '@forge/bridge';
const App = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    invoke('getBlogs', { example: 'my-invoke-variable' }).then(setBlogs);
  }, []);

  return (
    <>
    <Text>
        Number of blogposts in this conflunce instance: {blogs}
    </Text>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
