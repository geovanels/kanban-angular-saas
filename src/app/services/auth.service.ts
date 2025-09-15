import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import { Auth, user, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
         signOut, signInWithPopup, onAuthStateChanged, updateProfile } from '@angular/fire/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { Firestore, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private injector = inject(Injector);
  
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
      const currentUser = (this.auth as any).currentUser;
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
      const result = await runInInjectionContext(this.injector, () => signInWithPopup(this.auth, provider));
      
      // Criar ou atualizar usuário no Firestore
      await this.createOrUpdateUser(result.user);
      
      return result;
    } catch (error) {
      console.error('Erro no login com Google:', error);
      throw error;
    }
  }

  private async createOrUpdateUser(user: any) {
    try {
      // Verificar se o usuário já existe no Firestore
      const userDocRef = doc(this.firestore, 'users', user.uid);
      const userDoc = await runInInjectionContext(this.injector, () => getDoc(userDocRef));
      
      if (!userDoc.exists()) {
        await runInInjectionContext(this.injector, () => setDoc(userDocRef, {
          email: user.email,
          displayName: user.displayName,
          createdAt: new Date(),
          lastLogin: new Date()
        }));
      } else {
        // Atualizar lastLogin
        await runInInjectionContext(this.injector, () => updateDoc(userDocRef, {
          lastLogin: new Date()
        }));
      }
    } catch (error) {
      console.error('Erro ao criar/atualizar usuário:', error);
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
    return (this.auth as any).currentUser;
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map(user => !!user));
  }

  // Verificar se usuário tem empresa configurada
  async getUserCompany(userId: string): Promise<any> {
    try {
      const userDoc = await runInInjectionContext(this.injector, () => getDoc(doc(this.firestore, 'users', userId)));
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