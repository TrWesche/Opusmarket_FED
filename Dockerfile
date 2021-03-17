# https://mherman.org/blog/dockerizing-a-react-app/
# https://dzone.com/articles/how-to-dockerize-reactjs-app

## Part 1 - Build the Production React Image

# Specify the starting point image from docker-hub.  In this case its a docker image with node.js preinstalled on alpine linux.
FROM node:15.9.0-alpine3.10 as build

# Set Working Directory for the Container - Assuming the node environment comes with an /app folder based on other guides
WORKDIR /app

# Copy across the dependency description
COPY package.json /app

# Will execute npm install in /app due to WORKDIR selection
RUN npm install --legacy-peer-deps 

# Copy Build Files to Container
COPY . /app

# Run React Build
RUN npm run build 



## Part 2 - Deploy with nginx

# Specify the starting point image from docker-hub.  In this case its a docker image with nginx preinstalled on alpine linux to serve up the compiled React Application.
FROM nginx:1.19.7-alpine
ENV PORT=5001

EXPOSE $PORT

# Copy the built application to the appropriate location in the nginx Docker Container
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY ["nginx.conf", "/etc/nginx/nginx.conf"]
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'

## Additional Details -> Project Notes:Docker (Not shared in GIT repository) ##