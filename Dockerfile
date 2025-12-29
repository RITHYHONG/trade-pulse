FROM node:20-alpine

# Set working directory
WORKDIR /app

# Set environment variables for build
ENV NEXT_PUBLIC_FIREBASE_API_KEY=dummy
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dummy.firebaseapp.com
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=dummy
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dummy.appspot.com
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
ENV NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABCDEFGHIJ
ENV NEXTAUTH_SECRET=dummy
ENV DATABASE_URL=dummy

# Copy package files and yarn lock
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --production=false

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Expose port
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]