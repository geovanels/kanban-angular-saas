declare module 'firebase/auth' {
  export class GoogleAuthProvider {
    static readonly PROVIDER_ID: string;
    static credential(idToken?: string | null, accessToken?: string | null): any;
    constructor();
  }
}

declare module 'firebase/firestore' {
  export function serverTimestamp(): any;
}