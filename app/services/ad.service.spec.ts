import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// تعريف واجهة (Interface) للإعلان
export interface Ad {
  id: number;
  title: string;
  description: string;
  category: string;
  price?: number | null; // السعر اختياري
  imageUrl?: string; // الصورة اختيارية
  userId: number; // معرف المستخدم الذي نشر الإعلان - **هذا حقل مطلوب دائماً في الإعلان المخزن**
  username: string; // اسم المستخدم (للعرض) - **هذا حقل مطلوب دائماً في الإعلان المخزن**
  createdAt: Date;
}

// واجهة جديدة لبيانات الإعلان التي يتم إرسالها عند إضافة إعلان جديد
// هذه الواجهة لا تتضمن id, createdAt, userId, username لأن الخدمة ستضيفها
export interface NewAdPayload {
  title: string;
  description: string;
  category: string;
  price?: number | null;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdService {
  private ads: Ad[] = [
    {
      id: 1,
      title: 'Livre de cuisine ancien',
      description: 'Un livre de recettes de grand-mère, en très bon état.',
      category: 'Livres',
      price: 50,
      imageUrl: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=Livre',
      userId: 1,
      username: 'testuser',
      createdAt: new Date('2024-01-10T10:00:00Z')
    },
    {
      id: 2,
      title: 'Smartphone Android',
      description: 'Téléphone en bon état, fonctionne parfaitement. Modèle X.',
      category: 'Électronique',
      price: 200,
      imageUrl: 'https://via.placeholder.com/150/3366FF/FFFFFF?text=Smartphone',
      userId: 2,
      username: 'admin',
      createdAt: new Date('2024-01-15T14:30:00Z')
    },
    {
      id: 3,
      title: 'Veste en cuir',
      description: 'Veste vintage, taille M, peu portée.',
      category: 'Vêtements',
      price: 150,
      imageUrl: 'https://via.placeholder.com/150/33FF57/FFFFFF?text=Veste',
      userId: 1,
      username: 'testuser',
      createdAt: new Date('2024-01-20T09:15:00Z')
    },
    {
      id: 4,
      title: 'Jeu de société "Les Colons de Catane"',
      description: 'Version française complète, comme neuf.',
      category: 'Jeux',
      price: 40,
      imageUrl: 'https://via.placeholder.com/150/FF33CC/FFFFFF?text=Jeu',
      userId: 2,
      username: 'admin',
      createdAt: new Date('2024-01-25T11:00:00Z')
    },
    {
      id: 5,
      title: 'Plante verte d\'intérieur',
      description: 'Ficus benjamina, environ 1.5m de hauteur, très bien entretenu.',
      category: 'Maison & Jardin',
      price: null,
      imageUrl: 'https://via.placeholder.com/150/FFFF33/000000?text=Plante',
      userId: 1,
      username: 'testuser',
      createdAt: new Date('2024-02-01T16:45:00Z')
    }
  ];

  constructor() { }

  getAds(): Observable<Ad[]> {
    return of(this.ads).pipe(delay(500));
  }

  getAdById(id: number): Observable<Ad | undefined> {
    const ad = this.ads.find(a => a.id === id);
    return of(ad).pipe(delay(500));
  }

  // **تم تغيير نوع الواسطة الأولى هنا إلى NewAdPayload**
  addAd(adPayload: NewAdPayload, userId: number, username: string): Observable<Ad> {
    const newAd: Ad = {
      ...adPayload, // نستخدم NewAdPayload مباشرة
      id: this.ads.length > 0 ? Math.max(...this.ads.map(a => a.id)) + 1 : 1,
      userId: userId,
      username: username,
      createdAt: new Date()
    };
    this.ads.push(newAd);
    console.log('Nouvelle annonce ajoutée (simulée):', newAd);
    return of(newAd).pipe(delay(500));
  }

  updateAd(updatedAd: Ad): Observable<Ad | null> {
    const index = this.ads.findIndex(a => a.id === updatedAd.id);
    if (index > -1) {
      this.ads[index] = { ...updatedAd, createdAt: this.ads[index].createdAt };
      console.log('Annonce mise à jour (simulée):', this.ads[index]);
      return of(this.ads[index]).pipe(delay(500));
    }
    return of(null).pipe(delay(500));
  }

  deleteAd(id: number): Observable<boolean> {
    const initialLength = this.ads.length;
    this.ads = this.ads.filter(ad => ad.id !== id);
    console.log(`Annonce avec l'ID ${id} supprimée (simulée).`);
    return of(this.ads.length < initialLength).pipe(delay(500));
  }
}