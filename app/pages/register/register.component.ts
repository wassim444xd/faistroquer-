// src/app/pages/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { AuthService, NewUserPayload } from '../../services/auth.service';
import { Router } from '@angular/router';
// تم حذف: import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
    // تم حذف: private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void { }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
    }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      alert('Veuillez remplir tous les champs correctement.'); // تم التعديل
      this.registerForm.markAllAsTouched();
      return;
    }

    const { username, email, password } = this.registerForm.value;
    const newUser: NewUserPayload = { username, email, password, phone: 'N/A' };

    this.authService.register(newUser).subscribe({
      next: (user) => {
        if (user) {
          alert(`Compte créé مع النجاح for ${user.username}!`); // تم التعديل
          this.router.navigate(['/login']);
        } else {
          alert('Erreur lors de l\'inscription. Un utilisateur avec cet e-mail ou nom d\'utilisateur existe déjà.'); // تم التعديل
        }
      },
      error: (error) => {
        alert('Erreur lors de l\'inscription. Veuillez réessayer.'); // تم التعديل
        console.error('Registration error:', error);
      }
    });
  }
}