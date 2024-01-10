import api, { route, assumeTrustedRoute } from "@forge/api";

import { spacesCache } from './storage';

export const fetchBlogPosts = async ([navStack, updateNavStack], back) => {

    let ourRoute;

    let link;
    if (back) {
        link = navStack.stack[navStack.stack.length - 3]; // -1: next, -2: current, -3: previous
        updateNavStack({ stack: navStack.stack.slice(0, -2) }) // remove next and current
    }
    else {
        link = navStack.stack[navStack.stack.length - 1];
    }

    ourRoute = assumeTrustedRoute(link ?? `/wiki/api/v2/blogposts?sort=-created-date&limit=3`)

    const res = await api
        .asUser()
        .requestConfluence(ourRoute, {
            headers: {
                'Accept': 'application/json'
            }
        });

    const data = await res.json();
    return data;
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

    const uuidOrUrl = JSON.parse(data.results[0].value).id;

    const regex = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/);

    if (regex.test(uuidOrUrl))
        return fetchBlogImageInternalId(blogId, uuidOrUrl);

    return uuidOrUrl;
};

export const fetchBlogImageInternalId = async (blogId, fileId) => {
    const res = await api
        .asUser()
        .requestConfluence(route`/wiki/api/v2/blogposts/${blogId}/attachments`, {
            headers: {
                'Accept': 'application/json'
            }
        });

    const data = await res.json();

    return '/wiki' + data.results.find(x => x.fileId == fileId).downloadLink;

};