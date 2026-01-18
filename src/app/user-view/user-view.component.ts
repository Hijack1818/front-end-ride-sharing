import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { ApiService, Ride, RideRequest } from '../api.service';

@Component({
    selector: 'app-user-view',
    templateUrl: './user-view.component.html',
    styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {
    private map!: L.Map;
    private pickupMarker?: L.Marker;
    private dropoffMarker?: L.Marker;

    passengerId = '';
    isLoggedIn = false;
    tier = 'STANDARD';
    paymentMethod = 'CASH';

    pickupLat?: number;
    pickupLng?: number;
    dropoffLat?: number;
    dropoffLng?: number;

    currentRide?: Ride;
    rideStatus = '';

    constructor(private api: ApiService) { }

    ngOnInit(): void {
    }

    login(): void {
        if (!this.passengerId) return;
        this.isLoggedIn = true;

        // check for active ride
        this.api.getActiveRideForPassenger(this.passengerId).subscribe({
            next: (ride) => {
                if (ride) {
                    this.currentRide = ride;
                    this.startPolling(ride.id);
                }
                setTimeout(() => this.initMap(28.6139, 77.2090), 0);
            },
            error: () => setTimeout(() => this.initMap(28.6139, 77.2090), 0)
        });
    }

    private initMap(lat: number, lng: number): void {
        this.map = L.map('user-map').setView([lat, lng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        this.map.on('click', (e: L.LeafletMouseEvent) => {
            this.handleMapClick(e.latlng);
        });
    }

    private handleMapClick(latlng: L.LatLng): void {
        if (!this.pickupMarker) {
            this.pickupLat = latlng.lat;
            this.pickupLng = latlng.lng;
            this.pickupMarker = L.marker(latlng).addTo(this.map)
                .bindPopup('Pickup Location').openPopup();
        } else if (!this.dropoffMarker) {
            this.dropoffLat = latlng.lat;
            this.dropoffLng = latlng.lng;
            this.dropoffMarker = L.marker(latlng).addTo(this.map)
                .bindPopup('Dropoff Location').openPopup();
        } else {
            // Reset
            this.map.removeLayer(this.pickupMarker);
            this.map.removeLayer(this.dropoffMarker);
            this.pickupMarker = undefined;
            this.dropoffMarker = undefined;
            this.pickupLat = undefined;
            this.pickupLng = undefined;
            this.dropoffLat = undefined;
            this.dropoffLng = undefined;

            // Start new pickup
            this.handleMapClick(latlng);
        }
    }

    createRide(): void {
        if (!this.pickupLat || !this.dropoffLat) {
            alert('Please select pickup and dropoff locations on the map.');
            return;
        }

        const request: RideRequest = {
            passengerId: this.passengerId,
            pickupLat: this.pickupLat,
            pickupLng: this.pickupLng!,
            dropoffLat: this.dropoffLat,
            dropoffLng: this.dropoffLng!,
            pickupLocation: `${this.pickupLat.toFixed(4)}, ${this.pickupLng!.toFixed(4)}`,
            dropoffLocation: `${this.dropoffLat.toFixed(4)}, ${this.dropoffLng!.toFixed(4)}`,
            tier: this.tier,
            paymentMethod: this.paymentMethod
        };

        this.api.createRide(request).subscribe({
            next: (ride) => {
                this.currentRide = ride;
                this.startPolling(ride.id);
            },
            error: (err) => console.error(err)
        });
    }

    startPolling(rideId: string): void {
        const interval = setInterval(() => {
            this.api.getRide(rideId).subscribe(ride => {
                this.currentRide = ride;
                this.rideStatus = ride.status;
                if (ride.status === 'COMPLETED' || ride.status === 'CANCELLED') {
                    clearInterval(interval);
                }
            });
        }, 3000);
    }
}
