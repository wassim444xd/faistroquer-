// src/app/pages/contact/contact.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  successMessage: string = ''; // لإظهار رسالة النجاح
  errorMessage: string = '';   // لإظهار رسالة الخطأ

  ngOnInit(): void {
    this.contactForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      message: new FormControl('', Validators.required)
    });
  }

  onSubmit(): void {
    this.successMessage = ''; // مسح الرسائل السابقة
    this.errorMessage = '';   // مسح الرسائل السابقة

    if (this.contactForm.valid) {
      console.log('Formulaire de contact valide, valeurs:', this.contactForm.value);
      // هنا يمكنك إرسال البيانات إلى خدمة أو API حقيقية
      this.successMessage = 'Votre message a été envoyé avec succès !'; // <== استبدال alert()
      this.contactForm.reset();
    } else {
      console.log('Formulaire de contact invalide');
      this.contactForm.markAllAsTouched();
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires correctement.'; // <== استبدال alert()
    }
  }
}