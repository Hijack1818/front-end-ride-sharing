# Ride Sharing App - Frontend

This is the frontend client for the Ride Sharing Application, built with **Angular 16** and **Leaflet Maps**. It provides separate interfaces for Riders and Drivers to interact with the backend service.

## 🚀 Features

### Rider Interface (`/user`)
*   **Login**: Persistent login using a Passenger ID (e.g., `user-001`).
*   **Ride Request**: Interactive map to select Pickup (Green) and Dropoff (Red) locations.
*   **Real-time Status**: Polls for ride status updates (Matching -> Accepted -> In Progress -> Completed).
*   **State Persistence**: Restores active ride details upon re-login.

### Driver Interface (`/driver`)
*   **Login**: Persistent login using a Driver ID (e.g., `driver-001`).
*   **Location Management**: Click on map to update availability and location.
*   **Ride Discovery**: Polls for nearby pending ride requests (within 5km).
*   **Trip Management**: Accept rides, view trip details, and end trips.

## 🛠️ Prerequisites

*   **Node.js**: v16 or higher
*   **npm**: v8 or higher
*   **Backend**: The `simple-spring-boot` backend must be running on `http://localhost:8080`.

## 📦 Installation

1.  Navigate to the project directory:
    ```bash
    cd front-end-ride-sharing
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## ▶️ Running the Application

1.  Start the development server:
    ```bash
    npm start
    ```
2.  Open your browser and navigate to:
    *   **Main Menu**: [http://localhost:4200](http://localhost:4200)
    *   **Rider View**: [http://localhost:4200/user](http://localhost:4200/user)
    *   **Driver View**: [http://localhost:4200/driver](http://localhost:4200/driver)

## 🧪 How to Test the Flow

1.  **Start Backend**: Ensure the Spring Boot backend is running.
2.  **Rider Flow**:
    *   Open `/user`.
    *   Login as `user-001`.
    *   Click map to set Pickup and Dropoff.
    *   Select Tier/Payment and click **Request Ride**.
3.  **Driver Flow**:
    *   Open `/driver` (in a separate tab/window).
    *   Login as `driver-001`.
    *   **Important**: Click on the map to set your driver location. *You must be close to the rider's pickup to see the request.*
    *   Click **Accept** on the available ride.
4.  **Completion**:
    *   Observe status changes on both screens.
    *   Driver clicks **End Trip** to finish.

## 🔧 Configuration

*   **Backend URL**: Configured in `src/app/api.service.ts` as `http://localhost:8080/v1`.
*   **Map Defaults**: Default view is set to New Delhi (28.6139, 77.2090).

## 📁 Project Structure

*   `src/app/user-view`: Components for the Rider interface.
*   `src/app/driver-view`: Components for the Driver interface.
*   `src/app/api.service.ts`: Handles all HTTP communication with the backend.
