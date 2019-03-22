# Page Designer

Design rich text markdown pages in Rails application.

## Installation

Add the gem to your Gemfile

``
gem 'designer', github: 'sourcey/designer'
```

Run the installation task

```
rake designer:run_installer
```

Add the designer engine to your routes

```
mount Designer::Engine => "/designer"
```

Add `acts_as_designer` to each modal you want to use the designer on

```
acts_as_designer
```

Add designer.yml to your config folder.

Example config/designer.yml

```
---
image_sizes: &image_sizes
- 1920x
- 1280x
- 640x
- 480x
spec: &default_spec
  - label: Text
    template: text
    properties:
      text:
        type: string
        multiline: true
        markdown: true
  - label: Image
    template: image
    properties:
      image_key:
        type: string
      caption:
        type: string
      size:
        type: string
        enum: *image_sizes
      classes:
        type: array
        custom: true
        enum:
        - left
        - right
        - center
        - block
        - pull
        - parallax
  - label: Quote
    template: quote
    properties:
      text:
        type: string
        multiline: true
      cite:
        type: string
      classes:
        type: array
        custom: true
        enum:
        - left
        - right
        - center
        - block
        - pull
  - label: Separator
    template: separator
    properties:
      size:
        type: number
articles:
  preview_path: /articles/:slug
  designer_template_path: /articles/designer
  metadata_template_path: /articles/metadata
  spec: *default_spec
projects:
  preview_path: /:slug
  designer_template_path: /projects/designer
  metadata_template_path: /projects/metadata
  spec: *default_spec
```
