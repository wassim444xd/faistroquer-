// src/app/pages/edit-ad/edit-ad.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router'; // أضف ParamMap هنا
import { AdService, Ad, NewAdPayload } from '../../services/ad.service';

@Component({
  selector: 'app-edit-ad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-ad.component.html',
  styleUrl: './edit-ad.component.css'
})
export class EditAdComponent implements OnInit {
  adForm: FormGroup;
  adId: number | null = null;
  adToEdit: Ad | undefined;

  categories: string[] = [
    'Électronique',
    'Véhicules',
    'Immobilier',
    'Maison & Jardin',
    'Mode',
    'Sports & Loisirs',
    'Livres',
    'Services',
    'Autres'
  ];

  constructor(
    private fb: FormBuilder,
    private adService: AdService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.adForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      price: [null],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => { // <== تم التعديل هنا لإضافة نوع ParamMap
      const idParam = params.get('id');
      if (idParam) {
        this.adId = +idParam; // Convert string to number
        this.adService.getAdById(this.adId).subscribe({
          next: (ad) => {
            if (ad) {
              this.adToEdit = ad; // Store the original ad
              this.adForm.patchValue({
                title: ad.title,
                description: ad.description,
                category: ad.category,
                price: ad.price,
                imageUrl: ad.imageUrl
              });
            } else {
              alert('Annonce non trouvée.');
              this.router.navigate(['/my-ads']);
            }
          },
          error: (err) => {
            alert('Erreur lors du chargement de l\'annonce.');
            console.error('Error fetching ad for edit:', err);
            this.router.navigate(['/my-ads']);
          }
        });
      } else {
        alert('ID d\'annonce manquant pour la modification.');
        this.router.navigate(['/my-ads']);
      }
    });
  }

  onSubmit(): void {
    if (this.adForm.invalid) {
      alert('Veuillez remplir tous les champs obligatoires.');
      this.adForm.markAllAsTouched();
      return;
    }

    if (this.adId === null) {
      alert('ID d\'annonce manquant لـ la modification.');
      return;
    }

    const updatedAd: Ad = {
      id: this.adId,
      title: this.adForm.value.title,
      description: this.adForm.value.description,
      category: this.adForm.value.category,
      price: this.adForm.value.price ? Number(this.adForm.value.price) : undefined,
      imageUrl: this.adForm.value.imageUrl || undefined,
      userId: this.adToEdit!.userId,
      username: this.adToEdit!.username,
      postDate: this.adToEdit!.postDate
    };

    this.adService.updateAd(updatedAd).subscribe({
      next: (success) => {
        if (success) {
          alert('Annonce mise à jour avec succès !');
          this.router.navigate(['/ad-details', this.adId]);
        } else {
          alert('Échec de la mise à jour de l\'annonce.');
        }
      },
      error: (err) => {
        alert('Erreur lors de la mise à jour de l\'annonce.');
        console.error('Error updating ad:', err);
      }
    });
  }

  getFallbackImage(imageValue: string | undefined): string {
    if (imageValue && imageValue.startsWith('http')) {
      return imageValue;
    }
    return 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=No+Image';
  }
}