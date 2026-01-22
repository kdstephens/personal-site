---
title: Using Streamlit with RunPod
description: How to set up a Streamlit App using RunPod
tags: ["notes to self", "machine learning", "runpod", "streamlit"]
sort: 2
---

> [!info]- Second part of 3-part series
> This is the second part in a 3-part series about using RunPod to share Streamlit apps. You can view the other two parts here: 
>
> (1) [[Setting up RunPod]]
>
> (3) [[Use tmux with Streamlit]]

For work, I often make backend APIs for clients (typically with [FastAPI](https://fastapi.tiangolo.com/)). 

However, I sometimes need to demo a tool first, so a client can gauge the functionality and decide if it's something they want to incorporate. To make demos, I like to use [Streamlit](https://streamlit.io/) because it's easy and the UI looks nice. 

If you make an app with Streamlit, you can deploy it for free using [Streamlit Community Cloud](https://streamlit.io/cloud), but if your demo requires more than basic computing resources &mdash; e.g., if you need a GPU &mdash; than this won't work. 

In this case, you can share the app using RunPod with an exposed HTTP port. 


## Exposing HTTP ports in RunPod

When you click to add a Pod to your Network Volume, click "edit" on the Pod template (under "Configure Deployment"). Then, on the pop-up modal ("Pod Template Overrides"), you have the option to Expose HTTP Ports: 

![Alt RunPod Expose HTTP Port =500x](assets/images/runpod_http-port.png "RunPod Expose HTTP Ports")

The default port for Streamlit is 8501, so set this. Then, when you click on your deployed pod, the HTTP Service link is the one you can share once your Streamlit app is running: 

![Alt RunPod HTTP Service link =500x](assets/images/runpod_http-link.png "RunPod HTTP Service link")

> [!info]- Multiple Exposed Ports
> If your Pod already has an exposed HTTP Port (many come with Port 8888 exposed for Jupyter Lab), you can add more as a comma-separated list (e.g., *8888,8501*).  


## Guide to setting up a Streamlit App in RunPod

### Step 1: Make app "private" (optional)
To make a Streamlit app "private", simply add a password-protected login screen to the app. Here's example code: 
```python
# Towards the top of streamlit_app.py
#...
def check_password() -> bool:
    """Simple password gate using Streamlit secrets."""
    if "password_ok" not in st.session_state:
        st.session_state.password_ok = False

    if st.session_state.password_ok:
        return True

    st.title("🔒 Private App")
    st.caption("Ask Kyle for access")

    pw = st.text_input(
        "Enter password",
        type="password",
        key="password_input",
    )

    if pw:
        if hmac.compare_digest(pw, st.secrets["APP_PASSWORD"]):
            st.session_state.password_ok = True
            st.rerun()
        else:
            st.error("Incorrect password")

    return False


if not check_password():
    st.stop()
#...
```

Then, add a `secrets.toml` file to `.streamlit/` with a password you can share with your colleagues 

```python
#.streamlit/secrets.toml
APP_PASSWORD = "YourCustomPassword"
```

> [!warning]- Add to .gitignore
> Make sure to add `secrets.toml` or `.streamlit/` to `.gitignore` so you don't inadvertantly share the password publicly. 

Here's what this looks like for the user: 

![Alt Streamlit password =450x](assets/images/streamlit-password.png "Streamlit password page")

### Step 4: Shell script to run Streamlit app

To run a Streamlit app locally, you just type something like this in your terminal:

```shell
streamlit run app/streamlit_app.py
``` 

However, when running a Streamlit app from RunPod, there are a few more flags you need to pass to make it work properly: 
```shell
streamlit run app/streamlit_app.py \

# Allows RunPod Proxy to access the app:
  --server.address 0.0.0.0 \  

# Explicitly set listening port to avoid potential mismatch: 
  --server.port 8501 \

# Tells Streamlit: "You are a server-only app, don't try to act like a desktop":
  --server.headless true \

# Disabling CORS avoids issues related to how RunPod serves the app (via reverse proxy):
  --server.enableCORS false \

# Disabling CSRF (XSRF) token checks avoids issues related to how RunPod serves the app:
  --server.enableXsrfProtection false
```
I recommend putting all of this into a shell script on `/workspace`, so you can just type `/workspace/start_streamlit.sh` to start the app from a terminal connected to the pod. 

#### Example shell script: 

```shell
#!/usr/bin/env bash
set -e                  # Imediately exit script in case of errors
source /workspace/venvName/bin/activate # Activate virtual env

cd /workspace/git-repo  # Repository with the code you want to run

streamlit run app/streamlit_app.py \
  --server.address 0.0.0.0 \
  --server.port 8501 \
  --server.headless true \
  --server.enableCORS false \
  --server.enableXsrfProtection false
```

Obviously, change `/venvName/` to the name of your virtual environment and `/git-repo` to the name of your repository. 

Once your app is running, simply share the HTTP service link for your Pod (see image above) and anyone can access it!