// src/app/pages/my-ads/my-ads.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs'; // تم إزالة combineLatest
import { filter, map, switchMap, catchError } from 'rxjs/operators';
import { AdService, Ad } from '../../services/ad.service';
import { AuthService, User } from '../../services/auth.service';
// تم حذف: import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-ads',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-ads.component.html',
  styleUrl: './my-ads.component.css'
})
export class MyAdsComponent implements OnInit {
  myAds$: Observable<Ad[]> | undefined;
  currentUser: User | null = null;

  constructor(
    private adService: AdService,
    private authService: AuthService,
    private router: Router
    // تم حذف: private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;

    if (!this.currentUser) {
      alert('Vous devez être connecté pour voir vos annonces.'); // تم التعديل
      this.router.navigate(['/login']);
      return;
    }

    this.myAds$ = this.adService.getAllAds().pipe( // <== تم تغيير getAds() إلى getAllAds()
      map((ads: Ad[]) => ads.filter(ad => ad.userId === this.currentUser!.id)),
      catchError(error => {
        alert('Erreur lors du chargement de vos annonces.'); // تم التعديل
        console.error('Error fetching my ads:', error);
        return of([]);
      })
    );
  }

  deleteAd(adId: number | undefined): void {
    if (adId === undefined) {
      alert('ID d\'annonce manquant pour la suppression.'); // تم التعديل
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer cette annonce ؟')) {
      this.adService.deleteAd(adId).subscribe({
        next: (success) => {
          if (success) {
            alert('Annonce supprimée avec succès !'); // تم التعديل
            // Refresh the ads list by re-fetching (or remove from current array)
            // A simple re-fetch for demo purposes:
            this.ngOnInit(); // Re-trigger ngOnInit to refresh the list
          } else {
            alert('Impossible de trouver l\'annonce à supprimer.'); // تم التعديل
          }
        },
        error: (err) => {
          alert('Erreur lors de la suppression de l\'annonce.'); // تم التعديل
          console.error('Error deleting ad:', err);
        }
      });
    }
  }

  getFallbackImage(imageValue: string | undefined): string {
    if (imageValue && imageValue.startsWith('http')) {
      return imageValue;
    }
    return 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=No+Image';
  }
}