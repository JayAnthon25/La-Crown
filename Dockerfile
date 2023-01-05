# Copied from https://www.koyeb.com/tutorials/how-to-dockerize-and-deploy-a-next-js-application-on-koyeb

# used to install dependencies
# FROM node:lts-alpine3.15 as dependencies
# WORKDIR /usr/src/app
# COPY package.json package-lock.json ./
# RUN npm install

# used to build the Next.js app
# FROM node:lts-alpine3.15 as builder
# WORKDIR /usr/src/app
# COPY . .
# COPY --from=dependencies /usr/src/app/node_modules ./node_modules
# RUN npm run build

# used to configure the runtime environment of the Next.js app
# FROM node:lts-alpine3.15 as runner
# WORKDIR /usr/src/app
# ENV NODE_ENV=production
# If you are using a custom next.config.js file, uncomment this line.
# COPY --from=builder /usr/src/app/next.config.js ./
# COPY --from=builder /usr/src/app/public ./public
# COPY --from=builder /usr/src/app/.next ./.next
# COPY --from=builder /usr/src/app/node_modules ./node_modules
# COPY --from=builder /usr/src/app/package.json ./package.json

# EXPOSE 3000
# CMD ["npm", "run", "start"]