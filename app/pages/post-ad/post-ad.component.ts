// src/app/pages/post-ad/post-ad.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdService, NewAdPayload } from '../../services/ad.service';
import { AuthService, User } from '../../services/auth.service';
import { Router } from '@angular/router';
// تم حذف: import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post-ad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-ad.component.html',
  styleUrl: './post-ad.component.css'
})
export class PostAdComponent implements OnInit {
  adForm: FormGroup;
  currentUser: User | null = null;

  // <== تم إضافة هذه الخاصية
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
    private authService: AuthService,
    private router: Router
    // تم حذف: private toastr: ToastrService
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
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      alert('Vous devez être connecté pour publier une annonce.'); // تم التعديل
      this.router.navigate(['/login']);
    }
  }

  onSubmit(): void {
    if (this.adForm.invalid) {
      alert('Veuillez remplir tous les champs obligatoires.'); // تم التعديل
      this.adForm.markAllAsTouched();
      return;
    }

    if (!this.currentUser) {
      alert('Utilisateur non identifié. Veuillez vous reconnecter.'); // تم التعديل
      this.router.navigate(['/login']);
      return;
    }

    const newAd: NewAdPayload = {
      title: this.adForm.value.title,
      description: this.adForm.value.description,
      category: this.adForm.value.category,
      price: this.adForm.value.price ? Number(this.adForm.value.price) : undefined,
      imageUrl: this.adForm.value.imageUrl || undefined
    };

    this.adService.addAd(newAd, this.currentUser.id, this.currentUser.username).subscribe({
      next: (ad) => {
        alert('Annonce publiée avec succès !'); // تم التعديل
        this.adForm.reset();
        setTimeout(() => {
          this.router.navigate(['/my-ads']);
        }, 1500);
      },
      error: (err) => {
        alert('Erreur lors de la publication de l\'annonce.'); // تم التعديل
        console.error('Error posting ad:', err);
      }
    });
  }
}