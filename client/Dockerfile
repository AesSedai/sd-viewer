FROM node:16.10.0-alpine3.13

# RUN apk --no-cache add curl

# Create app directory
WORKDIR /usr/src/app

# for Devspace helper
RUN apk add --no-cache curl

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npm install -g serve
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
