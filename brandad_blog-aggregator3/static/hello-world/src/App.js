import React, { useEffect, useState } from 'react';

import { fetchBlogPosts, fetchBlogSpace, fetchBlogImage } from './api-service';
import { spacesCache } from './storage';
import { router } from '@forge/bridge';

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
    return blogPosts.map((post, index) => (
        <button className="blog-link" onClick={() => { router.navigate('/wiki' + post._links.webui); }}>
            <div key={index} className="flex-item">
                <img className="blog-image" alt="Bild" src={post.__image} />
                <div className="overlay">
                    <div className="blog-details">
                        <span className="blog-title">{post.title}</span>
                        <span>{new Date(post.createdAt)?.toLocaleString('de-DE') ?? 'undefined'}</span>
                        <span className="blog-space-name">{spacesCache[post.spaceId]?.name ?? 'undefined'}</span>
                    </div>
                </div>
            </div>
        </button>
    ));
};

function App() {
    const [blogs, setBlogs] = useState(undefined);

    useEffect(async () => {
        setBlogs(await loadBlog(undefined));
    }, []);

    return (
        <div class="text-light">
            Number of blogposts in this confluence instance: {blogs?.results?.length}
            <div class="flex-container">
                {renderBlogPostElements(blogs?.results ?? [])}
            </div>
        </div>
    );
}

export default App;
