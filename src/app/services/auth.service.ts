import { Injectable, inject } from '@angular/core';
import { Auth, user, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
         signOut, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, updateProfile } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  
  user$ = user(this.auth);
  
  async signInWithEmail(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return { success: true, user: result.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createUserWithEmail(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      return { success: true, user: result.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateUserProfile(profile: { displayName?: string; phoneNumber?: string; photoURL?: string }) {
    try {
      const currentUser = this.auth.currentUser;
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      // Atualizar perfil no Firebase Auth
      await updateProfile(currentUser, {
        displayName: profile.displayName,
        photoURL: profile.photoURL
      });

      // Salvar informações adicionais no Firestore
      await setDoc(doc(this.firestore, 'users', currentUser.uid), {
        email: currentUser.email,
        displayName: profile.displayName || currentUser.displayName,
        phoneNumber: profile.phoneNumber,
        photoURL: profile.photoURL || currentUser.photoURL,
        createdAt: new Date(),
        lastLogin: new Date()
      });
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async signUpWithEmail(email: string, password: string, displayName: string) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      
      // Atualizar perfil
      await this.updateUserProfile({ displayName });
      
      return { success: true, user: result.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      
      // Verificar se o usuário já existe no Firestore
      const userDoc = await getDoc(doc(this.firestore, 'users', result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(this.firestore, 'users', result.user.uid), {
          email: result.user.email,
          displayName: result.user.displayName,
          createdAt: new Date(),
          lastLogin: new Date()
        });
      } else {
        // Atualizar último login
        await setDoc(doc(this.firestore, 'users', result.user.uid), {
          lastLogin: new Date()
        }, { merge: true });
      }
      
      return { success: true, user: result.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map(user => !!user));
  }

  // Verificar se usuário tem empresa configurada
  async getUserCompany(userId: string): Promise<any> {
    try {
      const userDoc = await getDoc(doc(this.firestore, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData['companyId'] || null;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar empresa do usuário:', error);
      return null;
    }
  }

  // Associar usuário a uma empresa
  async linkUserToCompany(userId: string, companyId: string): Promise<void> {
    try {
      await setDoc(doc(this.firestore, 'users', userId), {
        companyId,
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
      console.error('Erro ao associar usuário à empresa:', error);
      throw error;
    }
  }
}