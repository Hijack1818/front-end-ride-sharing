import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RideRequest {
    passengerId: string;
    pickupLat: number;
    pickupLng: number;
    dropoffLat: number;
    dropoffLng: number;
    pickupLocation: string;
    dropoffLocation: string;
    tier: string;
    paymentMethod: string;
}

export interface Ride {
    id: string;
    passengerId: string;
    driverId: string;
    status: string;
    pickupLat: number;
    pickupLng: number;
    dropoffLat: number;
    dropoffLng: number;
    pickupLocation: string;
    dropoffLocation: string;
    fare: number;
    currency: string;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    // Use 8080 as that's standard for Spring Boot
    private baseUrl = 'http://localhost:8080/v1';

    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        // Basic Auth: admin:password
        return new HttpHeaders({
            'Authorization': 'Basic ' + btoa('admin:password')
        });
    }

    createRide(request: RideRequest): Observable<Ride> {
        return this.http.post<Ride>(`${this.baseUrl}/rides`, request, { headers: this.getAuthHeaders() });
    }

    getRide(id: string): Observable<Ride> {
        return this.http.get<Ride>(`${this.baseUrl}/rides/${id}`, { headers: this.getAuthHeaders() });
    }

    getAvailableRides(lat: number, lng: number): Observable<Ride[]> {
        return this.http.get<Ride[]>(`${this.baseUrl}/rides/available`, {
            headers: this.getAuthHeaders(),
            params: {
                lat: lat.toString(),
                lng: lng.toString()
            }
        });
    }

    acceptRide(driverId: string, rideId: string): Observable<Ride> {
        return this.http.post<Ride>(`${this.baseUrl}/drivers/${driverId}/accept`, null, {
            headers: this.getAuthHeaders(),
            params: { rideId }
        });
    }

    updateDriverLocation(driverId: string, lat: number, lng: number): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/drivers/${driverId}/location`,
            { latitude: lat, longitude: lng },
            { headers: this.getAuthHeaders() }
        );
    }

    endTrip(driverId: string, rideId: string): Observable<Ride> {
        return this.http.post<Ride>(`${this.baseUrl}/drivers/${driverId}/end`, null, {
            headers: this.getAuthHeaders(),
            params: { rideId }
        });
    }

    getActiveRideForPassenger(passengerId: string): Observable<Ride> {
        return this.http.get<Ride>(`${this.baseUrl}/rides/active/passenger/${passengerId}`, { headers: this.getAuthHeaders() });
    }

    getActiveRideForDriver(driverId: string): Observable<Ride> {
        return this.http.get<Ride>(`${this.baseUrl}/rides/active/driver/${driverId}`, { headers: this.getAuthHeaders() });
    }

    getAddress(lat: number, lng: number): Observable<any> {
        return this.http.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    }
}
