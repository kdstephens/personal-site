---
title: Using tmux with Streamlit
description: Notes about using tmux to ensure persistence of Streamlit apps on RunPod
tags: ["notes to self", "machine learning", "runpod", "streamlit", "tmux"]
sort: 3
---

> [!info]- Third part of 3-part series
> This is the third part in a 3-part series about using RunPod to share Streamlit apps. Here are the first two parts: 
> 1. [[Setting up RunPod]]
> 2. [[Use Streamlit with RunPod]]

At this point in the series, I know how to set up a Streamlit app in RunPod and share it via an HTTP Service link. 🥳

However, there is a problem with this setup. What happens if I close the terminal window running the Streamlit app? Or if my computer goes to sleep? Well, then the Streamlit app will stop running. 

What I need is a way to *persist* the terminal session running Streamlit, even if I close the terminal window or my computer goes to sleep. What I need is *tmux*. 

## tmux to the rescue

[tmux](https://en.wikipedia.org/wiki/Tmux) is an open-source terminal multiplexer. This means it allows one to run multiple, simultaneous terminal sessions in a single window. 

Most importantly for the present purposes, terminal sessions started with tmux *persist* &mdash; I can *detach* from a tmux session and it will keep running in the background even if I close the terminal window. I can then *reattach* to it later to check on progress, make changes, or close it down. For a good primer on tmux see this [video from typecraft](https://www.youtube.com/watch?v=niuOc02Rvrc). 

Here's how to use tmux with a RunPod-hosted Streamlit app. 

## Steps: tmux with Streamlit on RunPod

### 1. Connect to the Pod from the terminal via SSH.
Clicking on the Pod shows the code I need to connect. Just paste it into the terminal. 

### 2. Install tmux
```shell
apt-get update
apt-get install -y tmux
```

### 3. Create a new terminal session:
```shell
tmux new -s streamlit
```
I like to give my sessions a name, so I don't get confused later. I've called this one "streamlit." 

### 4. Inside tmux, start the app:
```shell
./start_streamlit.sh
```
Following from the [[Use Streamlit with RunPod|previous article in this series]], I assume I'm in the `/workspace` folder on my Pod and I've already written a shell script (`start_streamlit.sh`) that starts the Streamlit app. 

### 5. Detach from tmux session:
Hit `ctrl+b` on the keyboard, then type `d`. 

In tmux, `ctrl+b` is the default prefix key. It acts as a trigger that alerts tmux to listen for a command. The `d` command tells tmux to "detach" from the current terminal session. After this, I should see something like 
```shell
[detached (from session streamlit)]
``` 
Now the Streamlit app is safely running in the background and will continue so long as the Pod is active. I can exit my SSH from the Pod, close the terminal, and shut down my computer &mdash; my colleagues will still be able to access the running Streamlit app. 

### 6. Reattach anytime:
```shell
tmux attach -t streamlit
```
Just replace "streamlit" with whatever I called the terminal session. I can also just type `tmux attach` and it will attach to the most recent session. Then, I can then see the Streamlit app running. To shut down the app, type `exit` while attached via tmux.  
