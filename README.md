# Drone spotter back-end
Back-end code for Reaktor Developer Trainee Pre-Assignment 2023

![CI tests](https://github.com/mmoila/drone_spotter_backend/actions/workflows/main.yml/badge.svg)
[![codecov](https://codecov.io/gh/mmoila/drone_spotter_backend/branch/main/graph/badge.svg?token=6HfeX7tAid)](https://codecov.io/gh/mmoila/drone_spotter_backend)

Link to [front-end repository](https://github.com/mmoila/drone_spotter_frontend).

The running application can be accessed via https://drone-stalker.fly.dev/.

## About

The app is built using Node JS in the back-end and React in the front-end.

The back end polls every two seconds for drone data in assignments.reaktor.com/birdnest/drones and adds pilot information for drones which are within 100 m radius from the nest.
The back-end uses MongoDB to store the data for 10 minutes. When a client connects to the URL above, a websocket connection is established between the front and back-end.
This connection is used to provide drone data to the React application which displays the data in a table and also in a map view.

The application's table shows a list of intruder drones from the past 10 minutes and the closest confimed distance to the nest. The map view shows visually the latest observation of drones from the past 10 minutes.
The closest observation (and other additional info) in the map view can be checked by clicking (or tapping) the respective drone icon on the map.

## Running the app on a local computer (for Linux and MacOS)

You can run the app locally by following these steps:

- Download the back-end and the linked front-end repository under the same parent folder. Folder names should be drone_spotter_backend and drone_spotter_frontend.
- Set at least MONGODB_URI environmental variable for the database in the back-end folder. You can use local MongoDB or MongoDB Atlas.
- Install required dependencies in the back-end folder:

  ```bash 
  npm run install-dependencies
  ```

- Run the build script from the back-end folder:

  ```bash
  npm run local-build
  ```

- Start the application from the back-end folder:

  ```bash
  npm start
  ```

- Now the application should be running on http://localhost:3001 or other port defined by environmental variable PORT
