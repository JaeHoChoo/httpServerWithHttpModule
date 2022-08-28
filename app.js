const http = require("http"); // (1)


const users = [
    {
      id: 1,
      name: "Rebekah Johnson",
      email: "Glover12345@gmail.com",
      password: "123qwe",
    },
    {
      id: 2,
      name: "Fabian Predovic",
      email: "Connell29@gmail.com",
      password: "password",
    },
  ];
  
  const posts = [
    {
      id: 1,
      title: "간단한 HTTP API 개발 시작!",
      content: "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현.",
      userId: 1,
    },
    {
      id: 2,
      title: "HTTP의 특성",
      content: "Request/Response와 Stateless!!",
      userId: 1,
    },
  ];
  //서버객체가 서버가된다.
  const server = http.createServer();
  // 아래에 코
const httpRequestListener = function (request, response) {
    // 구조분해 할당
    const { url, method } = request
    //위의 선언은 cosnst url = request.url   const method = request.method
    //endpoint를 추가하기 위해 가져오는것.
    //missiont 1. 회원가입 , 2. 계시물등록
    //endpoint를 구현하기위해서 메소드와 타겟 두개를 사용하는 방법밖에 없다.   
    if (method === "GET") {
          if (url === '/ping') {
              response.writeHead(200, {'Content-Type' : 'application/json'});
              response.end(JSON.stringify({message : 'pong'}));
          }
      } else if (method === "POST") { // (3)
          if (url === '/users/signup') {
              let body = ''; // (4)
              request.on('data', (data) => {body += data;}) // (5)
              
              // stream을 전부 받아온 이후에 실행
              request.on('end', () => {  // (6)
                  const user = JSON.parse(body); //(7) 
                 
                  users.push({ // (8)
                      id : user.id,
                      name : user.name,
                      email: user.email,
                      password : user.password,
                    });
                  //
                  response.writeHead(200, {'Content-Type' : 'application/json'});
                  response.end(JSON.stringify({message : 'userCreated'})); // (9)
              });
          } else if(url === '/posts'){
            let body = ''; // (4)
            request.on('data', (data) => body += data);
            request.on('end',()=>{
                const post = JSON.parse(body);
                const user = users.find((user) => user.id === post.userId);
                if(user){
                    post.push({
                        id: post.id,
                        name: post.title,
                        content: post.content,
                        userId: post.userId,
                    });
                    response.writeHead(201, {"Content-Type": "application/json"});
                    response.end(JSON.stringify({ message: "ok!"}));
                } else {
                    response.writeHead(404, {"Content-Type": "application/json"});
                    response.end(JSON.stringify({ message: "NOT FOUND"}));
                }
            });
          }
    }
  };
  
  server.on("request", httpRequestListener);
  server.listen(8000, '127.0.0.1', function() { 
      console.log('Listening to requests on port 8000');
  });
  