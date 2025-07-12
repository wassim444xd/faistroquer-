// src/app/pages/ad-details/ad-details.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common'; // لـ | currency و | date
import { ActivatedRoute, RouterLink, ParamMap } from '@angular/router'; // أضف ParamMap هنا
import { Observable, of } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { AdService, Ad } from '../../services/ad.service';

@Component({
  selector: 'app-ad-details',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe], // أضف Pipes هنا
  templateUrl: './ad-details.component.html',
  styleUrl: './ad-details.component.css'
})
export class AdDetailsComponent implements OnInit {
  ad$!: Observable<Ad | undefined>;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private adService: AdService
  ) { }

  ngOnInit(): void {
    this.ad$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => { // <== تم التعديل هنا لإضافة نوع ParamMap
        this.loading = true; // Set loading to true when fetching starts
        const adId = params.get('id');
        if (adId) {
          return this.adService.getAdById(+adId).pipe(
            tap(() => this.loading = false), // Set loading to false on success
            catchError(err => {
              console.error('Error fetching ad details:', err);
              this.loading = false; // Set loading to false on error
              return of(undefined); // Return undefined to indicate not found or error
            })
          );
        } else {
          this.loading = false; // No ID, so not loading
          return of(undefined);
        }
      })
    );
  }

  getFallbackImage(imageValue: string | undefined): string {
    if (imageValue && imageValue.startsWith('http')) {
      return imageValue;
    }
    return 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=No+Image';
  }
}