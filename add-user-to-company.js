// Script para adicionar usuário à subcoleção users da empresa
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, getDocs, query, where } = require('firebase/firestore');

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB8wAgN-sgQaBybaaVAw9sXUDs5Z6r7Wcw",
  authDomain: "kanban-gobuyer.firebaseapp.com",
  projectId: "kanban-gobuyer",
  storageBucket: "kanban-gobuyer.firebasestorage.app",
  messagingSenderId: "269726968959",
  appId: "1:269726968959:web:6aaf53ba4f7bf6b64d39c9"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addUserToCompany() {
  try {
    console.log('🔍 Buscando empresa Gobuyer...');

    // Buscar empresa pelo subdomain
    const companiesRef = collection(db, 'companies');
    const q = query(companiesRef, where('subdomain', '==', 'gobuyer'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.error('❌ Empresa Gobuyer não encontrada!');
      return;
    }

    const companyDoc = snapshot.docs[0];
    const companyId = companyDoc.id;
    const companyData = companyDoc.data();

    console.log('✅ Empresa encontrada:', {
      id: companyId,
      name: companyData.name,
      subdomain: companyData.subdomain
    });

    // Dados da Rayane
    const userData = {
      email: 'rayane.crisostomo@gobuyer.com.br',
      uid: 'bcPgGNx14ceJiauo1jM61yld1Hf1',
      displayName: 'Rayane Crisostomo',
      role: 'user',
      permissions: [
        'leads.read',
        'leads.create',
        'leads.update',
        'boards.read',
        'templates.read',
        'automations.read'
      ],
      inviteStatus: 'accepted',
      joinedAt: new Date(),
      inviteToken: null
    };

    console.log('\n📝 Adicionando usuária à empresa...');
    console.log('Dados:', userData);

    // Adicionar usuário na subcoleção companies/{companyId}/users/{email}
    const userRef = doc(db, 'companies', companyId, 'users', userData.email);
    await setDoc(userRef, userData);

    console.log('\n✅ Usuária adicionada com sucesso!');
    console.log('📍 Path:', `companies/${companyId}/users/${userData.email}`);
    console.log('\n🎉 Rayane agora pode fazer login!');

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

addUserToCompany()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
