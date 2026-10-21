---
layout: "modules/notes/topic.layout.njk"
topicNotesQuery:
  filter:
    - ["filePathStem", "matches", "^/Writing/"]
  sort: ["data.sort", "title"]
panel: false
---
