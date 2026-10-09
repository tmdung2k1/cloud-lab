FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build production bundle, then serve it with `vite preview`
# (preview uses allowedHosts/proxy/PORT from vite.config.ts)
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview"]