// src/app/services/ad.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, filter } from 'rxjs/operators';

// Define the Ad interface
export interface Ad {
  id?: number;
  title: string;
  description: string;
  category: string;
  price?: number; // Optional, for exchange items
  imageUrl?: string; // Optional image URL
  userId: number; // ID of the user who posted the ad
  username: string; // Username of the user who posted the ad
  postDate: string; // Date the ad was posted (e.g., 'YYYY-MM-DD')
}

@Injectable({
  providedIn: 'root'
})
export class AdService {
  // Mock data for ads
  private ads: Ad[] = [
    { id: 1, title: 'Smartphone Android', description: 'Téléphone en bon état, fonctionne parfaitement. Modèle X.', category: 'Électronique', price: 15000, imageUrl: 'https://images.unsplash.com/photo-1598327105263-d1f03f39d846?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', userId: 1, username: 'testuser', postDate: '2024-01-15' },
    { id: 2, title: 'Livre de cuisine', description: 'Livre de recettes variées, très peu utilisé.', category: 'Livres', price: 2500, imageUrl: 'https://images.unsplash.com/photo-1549429446-2410a56e7039?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', userId: 2, username: 'johnDoe', postDate: '2024-01-20' },
    { id: 3, title: 'Vélo de ville', description: 'Vélo en bon état, idéal pour les déplacements urbains.', category: 'Véhicules', price: 30000, imageUrl: 'https://images.unsplash.com/photo-1484293809623-cfd4314e3049?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', userId: 1, username: 'testuser', postDate: '2024-02-01' },
    { id: 4, title: 'Enceinte Bluetooth', description: 'Enceinte portable, son de qualité. Quelques égratignures.', category: 'Électronique', price: 8000, imageUrl: 'https://images.unsplash.com/photo-1620063234988-3485ae15a31a?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', userId: 2, username: 'johnDoe', postDate: '2024-02-10' },
    { id: 5, title: 'Lot de vêtements bébé', description: 'Vêtements de 0-6 mois, excellent état.', category: 'Vêtements', price: 5000, imageUrl: 'https://images.unsplash.com/photo-1614066046187-5755106d15a5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', userId: 1, username: 'testuser', postDate: '2024-02-25' },
    { id: 6, title: 'Appareil photo numérique', description: 'Appareil photo compact, idéal pour débuter en photographie.', category: 'Électronique', price: 25000, imageUrl: 'https://images.unsplash.com/photo-1507963321153-f7053e1a8a25?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', userId: 2, username: 'johnDoe', postDate: '2024-03-01' },
    { id: 7, title: 'Console de jeux vintage', description: 'Ancienne console fonctionnelle avec quelques jeux.', category: 'Jeux', price: 10000, imageUrl: 'https://images.unsplash.com/photo-1542475456-4c924749f7e2?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', userId: 1, username: 'testuser', postDate: '2024-03-10' },
    { id: 8, title: 'Table basse en bois', description: 'Table basse solide en bois massif, quelques traces d\'usure.', category: 'Maison & Jardin', price: undefined, imageUrl: 'https://images.unsplash.com/photo-1510626359516-7248f070014a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', userId: 2, username: 'johnDoe', postDate: '2024-03-15' }, // <== تم التعديل هنا: null إلى undefined
    { id: 9, title: 'Raquette de tennis', description: 'Raquette junior, très bon état. Idéale pour débutant.', category: 'Sports & Loisirs', price: 4000, imageUrl: 'https://images.unsplash.com/photo-1579549320857-e67c87c54178?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', userId: 1, username: 'testuser', postDate: '2024-03-20' },
    { id: 10, title: 'Montre connectée', description: 'Montre connectée multifonctions, neuve.', category: 'Électronique', price: 20000, imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', userId: 2, username: 'johnDoe', postDate: '2024-03-25' },
  ];
  private nextAdId = this.ads.length > 0 ? Math.max(...this.ads.map(ad => ad.id!)) + 1 : 1;

  constructor() { }

  getAllAds(): Observable<Ad[]> {
    return of(this.ads).pipe(delay(200));
  }

  getAdById(id: number): Observable<Ad | undefined> {
    return of(this.ads.find(ad => ad.id === id)).pipe(delay(200));
  }

  addAd(newAd: NewAdPayload, userId: number, username: string): Observable<Ad> {
    const ad: Ad = {
      ...newAd,
      id: this.nextAdId++,
      userId: userId,
      username: username,
      postDate: new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    };
    this.ads.push(ad);
    return of(ad).pipe(delay(200));
  }

  updateAd(updatedAd: Ad): Observable<boolean> {
    return of(true).pipe(
      delay(200),
      map(() => {
        const index = this.ads.findIndex(ad => ad.id === updatedAd.id);
        if (index > -1) {
          this.ads[index] = updatedAd;
          return true;
        }
        return false;
      })
    );
  }

  deleteAd(id: number): Observable<boolean> {
    return of(true).pipe(
      delay(200),
      map(() => {
        const initialLength = this.ads.length;
        this.ads = this.ads.filter(ad => ad.id !== id);
        return this.ads.length < initialLength;
      })
    );
  }
}

export interface NewAdPayload {
  title: string;
  description: string;
  category: string;
  price?: number;
  imageUrl?: string;
}