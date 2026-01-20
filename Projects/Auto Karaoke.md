---
title: Auto Karaoke
description: "A system that automatically makes a karaoke-style lyric video given an audio file for a song."
tags: ["project", "machine learning", "music"]
mermaid: true
sort: 1
---

For this project, I built a tool that takes input audio of a song (or song snippet) and outputs a karaoke-style lyric video for the song. 

This project was for a client, so the code is not publicly available, but below is a visual demonstration. 

To demo this for the client, I built a Streamlit app and shared it using RunPod (see [[Setting up Runpod#Regarding Streamlit and Exposed HTTP Ports|Using Streamlit with RunPod]])

{# ## Steps involved

<pre class="mermaid">
flowchart LR
    A["input audio"]
    B["transcription"]
    C["draft lyrics"]
    D["user corrected lyrics"]
    E["align corrected lyrics"]
    F["render video"]
    A --> B --> C --> D --> E --> F
</pre> #}

## Demo

NEXT: Insert video of me using the tool (hide details)