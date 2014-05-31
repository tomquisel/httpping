# client.js

Use this to ping an http server to measure latency between you and the server.
This is useful for cases where the server doesn't respond to ICMP traffic.
Httpping uses HTTP keep-alive, so TCP overhead is minimal.

### Examples
```
    node client.js localhost:8888/
```
```
    node client.js www.okcupid.com/
```

# server.js

If you don't have an http server running on the other end, use this to quickly
fire one up. This is especially useful for testing latency over an SSH tunnel.

### Examples
```
    node server.js
```
```
    node sever.js 1337
```

# SSH tunnel latency test

On the client:
```
    # set up the ssh tunnel
    ssh -L8888:localhost:8888 user@server.com
    # start sending http pings over the ssh tunnel
    node client.js localhost:8888/
    # http ping the server directly to see if the latency is caused by the tunnel
    node client.js server.com:8888/
```

On the server:
```
    node server.js 8888
```
