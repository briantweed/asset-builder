# Templates

`index.html` is used to create a landing page with links to the other pages

The name of the html template file is set in the `.env` file. The default setting is
```
HTML_TEMPLATE_FILE_NAME = template
```

### Available Tags

> *Make sure to include the spaces between the brackets and the tag*

- {{ page_name }}
- {{ project_title }}
- {{ theme_color }}
- {{ tile_color }}
- {{ css_file_name }}
- {{ css_file_suffix }}
- {{ js_file_name }}
- {{ js_file_suffix }}

