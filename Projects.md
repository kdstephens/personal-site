---
# description: "A list of notes about my Projects"
layout: "modules/notes/topic.layout.njk"
topicNotesQuery:
  filter:
    # A list of filter rows that must all match
    # Format: ["<property>", "<operator>", <value>]

    # Note must have the tag "project"
    - ["tags", "includes", "project"]
panel: false
nextPage: "[[Projects/Auto Karaoke]]"
---
