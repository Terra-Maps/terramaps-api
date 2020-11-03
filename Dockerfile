FROM node:12

#can be 'development' or 'production'
ENV NODE_ENV=development

# #your app port
ENV PORT=8080

#your mongo connection options
ENV MONGODB_URI=${MONGODB_URI}
ENV MONGODB_DB_MAIN=${MONGODB_DB_MAIN}
ENV MONGODB_ATLAS_OPTION=${MONGODB_ATLAS_OPTION}
ENV SECRET=${SECRET}

#your github strategy configuration
ENV GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}
ENV GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}
ENV GITHUB_CALLBACK_URL=${GITHUB_CALLBACK_URL}

#your gitlab strategy configuration
ENV GITLAB_CLIENT_ID=${GITLAB_CLIENT_ID}
ENV GITLAB_CLIENT_SECRET=${GITLAB_CLIENT_SECRET}
ENV GITLAB_CALLBACK_URL=${GITLAB_CALLBACK_URL}

# Create app directory
WORKDIR /app

# Bundle app source
COPY . /app

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production



EXPOSE 8080
CMD [ "npm", "start"]
