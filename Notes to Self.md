---
# description: "A list of my Notes to Self"
layout: "modules/notes/topic.layout.njk"
topicNotesQuery:
  filter:
    # A list of filter rows that must all match
    # Format: ["<property>", "<operator>", <value>]

    # Note must have the tag "project"
    - ["tags", "includes", "notes to self"]
panel: false
---
