// src/app/services/auth.service.ts

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';

import { isPlatformBrowser } from '@angular/common'; // <== تأكد من وجود هذا الاستيراد



import { BehaviorSubject, Observable, of } from 'rxjs';

import { delay, map } from 'rxjs/operators';



export interface User {

id: number;

username: string;

 email: string;

 phone?: string; // Optional field

 // Add other user properties as needed

}



export interface NewUserPayload {

 username: string;

 email: string;

 password: string;

 phone?: string;

}



@Injectable({

 providedIn: 'root'

})

export class AuthService {

// Mock users with passwords (for demo purposes only)

 private users: (User & { password: string })[] = [

 { id: 1, username: 'testuser', email: 'test@example.com', password: 'password123', phone: '0123456789' },

 { id: 2, username: 'johnDoe', email: 'john@example.com', password: 'password123', phone: '0987654321' },

 ];

 private nextUserId = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;



 // BehaviorSubject to hold the current user's authentication state

 private currentUserSubject: BehaviorSubject<User | null>;

 public currentUser: Observable<User | null>;



 // تم تعديل الـ constructor هنا لحقن PLATFORM_ID والتحقق من localStorage

 constructor(@Inject(PLATFORM_ID) private platformId: Object) {

 let storedUser = null;

 if (isPlatformBrowser(this.platformId)) { // التحقق مما إذا كنا في بيئة المتصفح

 storedUser = localStorage.getItem('currentUser');

 }

 this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);

 this.currentUser = this.currentUserSubject.asObservable();

}


 public get currentUserValue(): User | null {

 return this.currentUserSubject.value;

 }



 login(email: string, password: string): Observable<User | null> {

 return of(null).pipe(

 delay(500), // Simulate network delay

 map(() => {

 const user = this.users.find(u => u.email === email && u.password === password);

 if (user) {

 // Store user in localStorage (for persistence across sessions)

if (isPlatformBrowser(this.platformId)) { // التحقق قبل استخدام localStorage

 localStorage.setItem('currentUser', JSON.stringify(user));

 }

this.currentUserSubject.next(user);

 return user;

 }

 return null;

 })

 );
 }



 register(newUserPayload: NewUserPayload): Observable<User | null> {

 return of(null).pipe(

 delay(500), // Simulate network delay

 map(() => {

 const emailExists = this.users.some(u => u.email === newUserPayload.email);

 const usernameExists = this.users.some(u => u.username === newUserPayload.username);



 if (emailExists || usernameExists) {

 console.error('Registration failed: Email or username already exists');

 return null; // Indicates registration failed

}



const newUser: User & { password: string } = {

 id: this.nextUserId++,

username: newUserPayload.username,

 email: newUserPayload.email,

password: newUserPayload.password,

phone: newUserPayload.phone

 };

 this.users.push(newUser);

 return newUser; // Return the newly registered user

})

 );
}



logout(): void {

 // Remove user from localStorage

if (isPlatformBrowser(this.platformId)) { // التحقق قبل استخدام localStorage

localStorage.removeItem('currentUser');

 }
 this.currentUserSubject.next(null); // Clear current user in the subject

 }

}