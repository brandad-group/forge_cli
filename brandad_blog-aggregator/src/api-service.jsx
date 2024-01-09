import api, { route } from "@forge/api";

import { spacesCache } from './storage';

export const fetchBlogPosts = async () => {
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

export const fetchBlogSpace = async (spaceId) => {

    if (spacesCache[spaceId])
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

export const fetchBlogImage = async (blogId) => {
    const res = await api
        .asUser()
        .requestConfluence(route`/wiki/api/v2/blogposts/${blogId}/properties?key=cover-picture-id-published`, {
            headers: {
                'Accept': 'application/json'
            }
        });

    const data = await res.json();

    if (data.results.length != 1)
        return undefined;

    return JSON.parse(data.results[0].value);
};