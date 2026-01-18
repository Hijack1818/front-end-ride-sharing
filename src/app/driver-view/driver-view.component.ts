import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService, Ride } from '../api.service';
import * as L from 'leaflet';

@Component({
    selector: 'app-driver-view',
    templateUrl: './driver-view.component.html',
    styleUrls: ['./driver-view.component.css']
})
export class DriverViewComponent implements OnInit, OnDestroy {
    driverId = '';
    isLoggedIn = false;
    availableRides: Ride[] = [];
    activeRide?: Ride;
    pollInterval: any;

    // Map properties
    private map!: L.Map;
    private driverMarker?: L.Marker;
    driverLat?: number;
    driverLng?: number;

    constructor(private api: ApiService) { }

    ngOnInit(): void {
    }

    login(): void {
        if (!this.driverId) return;
        this.isLoggedIn = true;

        this.api.getActiveRideForDriver(this.driverId).subscribe({
            next: (ride) => {
                if (ride) {
                    this.activeRide = ride;
                }
                setTimeout(() => {
                    this.initMap(28.6139, 77.2090);
                    this.startPolling();
                }, 0);
            },
            error: () => {
                setTimeout(() => {
                    this.initMap(28.6139, 77.2090);
                    this.startPolling();
                }, 0);
            }
        });
    }

    private initMap(lat: number, lng: number): void {
        this.map = L.map('driver-map').setView([lat, lng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        this.map.on('click', (e: L.LeafletMouseEvent) => {
            this.updateDriverLocation(e.latlng.lat, e.latlng.lng);
        });
    }

    private updateDriverLocation(lat: number, lng: number): void {
        this.driverLat = lat;
        this.driverLng = lng;

        if (this.driverMarker) {
            this.driverMarker.setLatLng([lat, lng]);
        } else {
            this.driverMarker = L.marker([lat, lng]).addTo(this.map)
                .bindPopup('Your Location').openPopup();
        }

        // Notify backend of location update
        this.api.updateDriverLocation(this.driverId, lat, lng).subscribe();
    }

    ngOnDestroy(): void {
        if (this.pollInterval) clearInterval(this.pollInterval);
    }

    startPolling(): void {
        this.pollInterval = setInterval(() => {
            if (!this.activeRide) {
                // Only poll if driver has set a location
                if (this.driverLat && this.driverLng) {
                    this.api.getAvailableRides(this.driverLat, this.driverLng).subscribe({
                        next: (rides) => this.availableRides = rides,
                        error: (err) => console.error(err)
                    });
                }
            } else {
                // Poll active ride status
                this.api.getRide(this.activeRide.id).subscribe(ride => {
                    this.activeRide = ride;
                    if (ride.status === 'COMPLETED' || ride.status === 'CANCELLED') {
                        this.activeRide = undefined;
                    }
                });
            }
        }, 5000);
    }

    acceptRide(ride: Ride): void {
        this.api.acceptRide(this.driverId, ride.id).subscribe({
            next: (updatedRide) => {
                this.activeRide = updatedRide;
                this.availableRides = []; // Clear list
            },
            error: (err) => alert('Failed to accept ride: ' + err.message)
        });
    }

    endTrip(): void {
        if (this.activeRide) {
            this.api.endTrip(this.driverId, this.activeRide.id).subscribe({
                next: (ride) => {
                    this.activeRide = undefined;
                    alert(`Trip Ended. Fare: ${ride.currency} ${ride.fare}`);
                },
                error: (err) => console.error(err)
            });
        }
    }
}
