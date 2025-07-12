// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PostAdComponent } from './pages/post-ad/post-ad.component';
import { SearchComponent } from './pages/search/search.component';
import { AdDetailsComponent } from './pages/ad-details/ad-details.component';
import { MyAdsComponent } from './pages/my-ads/my-ads.component';
import { EditAdComponent } from './pages/edit-ad/edit-ad.component';
import { ContactComponent } from './pages/contact/contact.component'; // <== استورد هذا!

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'post-ad', component: PostAdComponent },
  { path: 'search', component: SearchComponent },
  { path: 'ad-details/:id', component: AdDetailsComponent },
  { path: 'my-ads', component: MyAdsComponent },
  { path: 'edit-ad/:id', component: EditAdComponent },
  { path: 'contact', component: ContactComponent }, // <== أضف هذا المسار!
  { path: '**', redirectTo: '' }
];