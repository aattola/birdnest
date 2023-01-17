# Monadikuikka
### https://monadikuikka.jeffe.co

Monadikuikka is the NodeJS typescript based solution to Reaktor's project birdnest assignment.
I chose Typescript and node because I'm quite familiar with them.

Running the program

You can run the program without docker but docker is the easiest way to get the backend running.

Build container
``docker docker build -t monadikuikka .``

And run it
``docker run -p 3000:3000 monadikuikka``

And navigate to http://localhost:3000

This only runs the backend. The frontend is not included in the docker container.

To run frontend you need to have node and npm installed. Then you can run the frontend with

First
``cd frontend``

Then
```bash
npm install

npm run dev
```

To run development server
``npm run build`` To build the frontend
