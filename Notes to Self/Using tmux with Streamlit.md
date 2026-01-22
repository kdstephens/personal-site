---
title: Using tmux with Streamlit
description: Notes about using tmux to ensure persistance of Streamlit apps on RunPod
tags: ["notes to self", "machine learning", "runpod", "streamlit", "tmux"]
sort: 3
---

> [!info]- Third part of 3-part series
> This is the third part in a 3-part series about using RunPod to share Streamlit apps. You can view the first two parts here: 
> 1. [[Setting up RunPod]]
> 2. [[Use Streamlit with RunPod]]

If you've been following along with this series, you now know how to set up a Streamlit app in RunPod and share it via an HTTP Service link. 🥳

However, there is problem with this set up. What happens if you close the terminal window running the Streamlit app? Or if, god forbid, your computer goes to sleep? Well, then your Streamlit app will stop running. 

What you need is a way to *persist* the terminal session running Streamlit, even if you close the terminal window or your computer goes to sleep. What you need is tmux. 

## tmux to the rescue

tmux is an open-source terminal multiplexer. This means it allows you to run multiple simultaneous terminal sessions in a single window. 

Most importatnly for our purposes, terminal sessions started with tmux *persist* &mdash; you can *detatch* from a tmux session and it will keep running in the background even if you close the terminal window. You can then *reatach* to it later to check on progress, make changes, or close it down. For a good primer on tmux see this [video from typecraft](https://www.youtube.com/watch?v=niuOc02Rvrc). 

Here's how to use tmux with our RunPod-hosted Streamlit app. 

## Steps: tmux with Streamlit on RunPod

### 1. Connect to the  Pod from your terminal via SSH.
If you click on the Pod, you can easily copy the code you need to connect. Just paste it into your terminal. 

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
Following from the [[Use Streamlit with RunPod|previous article in this series]], I'm assuming you're in the `/workspace` folder on your Pod and you've already written a shell script (`start_streamlit.sh`) that starts the Streamlit app. 

### 5. Detach from tmux session:
Hit `ctrl+b` on your keyboard, then type `d`. 

In tmux, `ctrl+b` is the default prefix key. It acts as a trigger that alerts tmux to listen for a command. the `d` command tells tmux to "detatch" from the current terminal session. After this, you should see something like 
```shell
[detached (from session streamlit)]
``` 
Now your Streamlit app is safely running in the background and will continue so long as your Pod is active. You can exit your SSH from the Pod, close your terminal, and shut down your computer, and your colleagues will still be able to access the running Streamlit app. 

### 6. Reattach anytime:
```shell
tmux attach -t streamlit
```
Just replace "streamlit" with whatever you called the terminal session. You can also just type `tmux attach` and it will attach to the most recent session. You can then see the Streamlit app running. To shut down the app, type `exit` while attached via tmux.  

