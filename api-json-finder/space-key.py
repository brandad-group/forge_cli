import json
import os

dir_path = os.path.dirname(os.path.realpath(__file__))

with open(os.path.join(dir_path, 'keys.json')) as f:
    data = json.load(f)

with open(os.path.join(dir_path, 'space-keys.html'), 'w') as f:
    if 'results' in data:
        for result in data['results']:
            if 'key' in result:
                f.write("<a href='https://brandad-wiki.atlassian.net/wiki/spaces/sidebarconfiguration.action?key=" + result['key'] + "'>" + result['key'] + "</a><br />\n")
            else:
                f.write('key not found in the result.\n')
    else:
        f.write('results not found in the JSON data.\n')