// Script para atualizar o UID da Rayane na subcoleção da empresa
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyB8wAgN-sgQaBybaaVAw9sXUDs5Z6r7Wcw",
  authDomain: "kanban-gobuyer.firebaseapp.com",
  projectId: "kanban-gobuyer",
  storageBucket: "kanban-gobuyer.firebasestorage.app",
  messagingSenderId: "269726968959",
  appId: "1:269726968959:web:6aaf53ba4f7bf6b64d39c9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function updateRayaneUid() {
  try {
    console.log('📝 Atualizando UID da Rayane...');

    const companyId = 'HJnEsxj7KfukkW2RSRgs';
    const userEmail = 'rayane.crisostomo@gobuyer.com.br';
    const uid = 'bcPgGNx14ceJiauo1jM61yld1Hf1';

    const userRef = doc(db, 'companies', companyId, 'users', userEmail);
    
    await updateDoc(userRef, {
      uid: uid
    });

    console.log('✅ UID atualizado com sucesso!');
    console.log('📍 Path:', `companies/${companyId}/users/${userEmail}`);
    console.log('🔑 UID:', uid);
    console.log('\n🎉 Agora peça para a Rayane fazer login!');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

updateRayaneUid()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
