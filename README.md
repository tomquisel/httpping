client.js:
Use this to ping an http server to measure latency between you and the server.
This is useful for cases where the server doesn't respond to ICMP traffic.
Httpping uses HTTP keep-alive, so TCP overhead is minimal.

Examples:
```
    node client.js localhost:8888/
```
```
    node client.js www.okcupid.com/
```

server.js:
If you don't have an http server running on the other end, use this to quickly fire one up. This is especially useful for testing latency over an SSH tunnel.

Examples:
```
    node server.js
```
```
    node sever.js 1337
```
