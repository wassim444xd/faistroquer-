// src/app/pages/search/search.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AdService, Ad } from '../../services/ad.service';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
// تم حذف: import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  categories: string[] = [
    'Toutes catégories', // Add "All Categories" option
    'Électronique', 'Vêtements', 'Livres', 'Maison & Jardin',
    'Sports & Loisirs', 'Véhicules', 'Jeux', 'Autres'
  ];

  allAds$: Observable<Ad[]>;
  filteredAds$: Observable<Ad[]>;

  // BehaviorSubjects for search and category filters
  private searchTermSubject = new BehaviorSubject<string>('');
  private selectedCategorySubject = new BehaviorSubject<string>('Toutes catégories'); // Default to "All Categories"

  constructor(
    private fb: FormBuilder,
    private adService: AdService
    // تم حذف: private toastr: ToastrService
  ) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      category: ['Toutes catégories'] // Default value
    });

    // Initialize allAds$ by fetching all ads from the service
    this.allAds$ = this.adService.getAllAds().pipe( // <== تم تغيير getAds() إلى getAllAds()
      catchError(error => {
        alert('Erreur lors du chargement des annonces.'); // تم التعديل
        console.error('Error fetching all ads:', error);
        return of([]); // Return an empty array on error
      })
    );

    // Update searchTermSubject when search input changes
    this.searchForm.get('searchTerm')?.valueChanges.pipe(
      debounceTime(300), // Wait for 300ms after the last keystroke
      distinctUntilChanged(), // Only emit if the value has changed
      startWith('') // Emit initial empty value
    ).subscribe(value => this.searchTermSubject.next(value));

    // Update selectedCategorySubject when category select changes
    this.searchForm.get('category')?.valueChanges.pipe(
      startWith('Toutes catégories') // Emit initial value
    ).subscribe(value => this.selectedCategorySubject.next(value));

    // Combine all observables to filter ads
    this.filteredAds$ = combineLatest([
      this.allAds$, // All ads from the service
      this.searchTermSubject.asObservable(),
      this.selectedCategorySubject.asObservable()
    ]).pipe(
      map(([ads, searchTerm, selectedCategory]) => {
        let filtered: Ad[] = ads; // Start with all ads

        // Filter by search term
        if (searchTerm) {
          const lowerCaseSearchTerm = searchTerm.toLowerCase();
          filtered = filtered.filter(ad =>
            ad.title.toLowerCase().includes(lowerCaseSearchTerm) ||
            ad.description.toLowerCase().includes(lowerCaseSearchTerm) ||
            ad.username.toLowerCase().includes(lowerCaseSearchTerm)
          );
        }

        // Filter by category
        if (selectedCategory && selectedCategory !== 'Toutes catégories') {
          filtered = filtered.filter(ad => ad.category === selectedCategory);
        }

        return filtered;
      })
    );
  }

  ngOnInit(): void {
    // No explicit initialization needed here as observables handle it
  }

  getFallbackImage(imageValue: string | undefined): string {
    if (imageValue && imageValue.startsWith('http')) {
      return imageValue;
    }
    return 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=No+Image';
  }
}