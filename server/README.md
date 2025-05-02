# Breeze Marine API Server

This is the API server for Breeze Marine Boat Service. It provides endpoints for managing bookings, boats, trailers, video calls, and users.

## Setup

1. Clone the repository
2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`
3. Create a `.env` file based on `.env.example` and fill in the required values
4. Start the development server:
   \`\`\`
   npm run dev
   \`\`\`

## Available Scripts

- `npm run dev`: Start the development server with hot reloading
- `npm run build`: Build the project for production
- `npm start`: Start the production server
- `npm test`: Run tests

## API Endpoints

### Authentication

- `POST /api/auth/login`: Login with email and password
- `POST /api/auth/register`: Register a new customer account

### Bookings

- `GET /api/bookings`: Get all bookings
- `GET /api/bookings/:id`: Get booking by ID
- `POST /api/bookings`: Create a new booking
- `PUT /api/bookings/:id`: Update a booking
- `DELETE /api/bookings/:id`: Delete a booking

### Boats

- `GET /api/boats`: Get all boats
- `GET /api/boats/:id`: Get boat by ID
- `POST /api/boats`: Create a new boat listing
- `PUT /api/boats/:id`: Update a boat listing
- `DELETE /api/boats/:id`: Delete a boat listing

### Trailers

- `GET /api/trailers`: Get all trailers
- `GET /api/trailers/:id`: Get trailer by ID
- `POST /api/trailers`: Create a new trailer
- `PUT /api/trailers/:id`: Update a trailer
- `DELETE /api/trailers/:id`: Delete a trailer
- `GET /api/trailers/rentals`: Get all trailer rentals
- `GET /api/trailers/rentals/:id`: Get trailer rental by ID
- `POST /api/trailers/rentals`: Create a new trailer rental
- `PATCH /api/trailers/rentals/:id/status`: Update trailer rental status

### Video Calls

- `GET /api/video-calls`: Get all video calls
- `GET /api/video-calls/:id`: Get video call by ID
- `POST /api/video-calls`: Create a new video call
- `PUT /api/video-calls/:id`: Update a video call
- `DELETE /api/video-calls/:id`: Delete a video call
- `GET /api/video-calls/available-slots/:date`: Get available time slots for a specific date

### Users

- `GET /api/users`: Get all users
- `GET /api/users/:id`: Get user by ID
- `POST /api/users`: Create a new user
- `PUT /api/users/:id`: Update a user
- `DELETE /api/users/:id`: Delete a user
- `POST /api/users/:id/change-password`: Change user password
- `POST /api/users/:id/reset-password`: Reset user password (admin only)
\`\`\`

Now, let's create a client-side service to interact with our API:
