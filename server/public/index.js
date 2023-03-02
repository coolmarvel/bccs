<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TEST</title>
  </head>
  <body>
    <div>개발자 도구 탭을 열어 Console 탭과 Network 탭을 확인해보세요.</div>
    <script>
      const webSocket = new WebSocket("ws://localhost:8080");
      webSocket.onopen = () => {
        console.log("server-client connected");
      };
      webSocket.onmessage = (event) => {
        console.log(event.data);
        webSocket.send("send reply to server from client");
      };
    </script>
  </body>
</html>
