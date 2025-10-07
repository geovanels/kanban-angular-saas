// Script para consultar usuários via Firestore usando emulador ou conexão direta
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where } = require('firebase/firestore');
const { getAuth, connectAuthEmulator } = require('firebase/auth');

// Configuração do Firebase (do environment.ts)
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

async function queryUsers() {
  const users = [
    'geovane.lopes@gobuyer.com.br',
    'rayane.crisostomo@gobuyer.com.br'
  ];

  console.log('🔍 Consultando dados dos usuários no Firestore...\n');

  for (const email of users) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📧 EMAIL: ${email}`);
    console.log('='.repeat(60));

    try {
      // Buscar em todas as empresas
      console.log('\n🏢 Buscando empresas...');
      const companiesRef = collection(db, 'companies');
      const companiesSnapshot = await getDocs(companiesRef);

      let foundInCompanies = [];

      for (const docSnap of companiesSnapshot.docs) {
        const companyData = docSnap.data();
        const users = companyData.users || [];

        const user = users.find(u => u.email === email);

        if (user) {
          foundInCompanies.push({
            companyId: docSnap.id,
            companyName: companyData.name,
            subdomain: companyData.subdomain,
            status: companyData.status,
            user: user
          });
        }
      }

      if (foundInCompanies.length > 0) {
        console.log(`\n✅ Encontrado em ${foundInCompanies.length} empresa(s):\n`);

        foundInCompanies.forEach((item, index) => {
          console.log(`  ${index + 1}. Empresa: ${item.companyName}`);
          console.log(`     - ID: ${item.companyId}`);
          console.log(`     - Subdomain: ${item.subdomain}`);
          console.log(`     - Status: ${item.status || 'N/A'}`);
          console.log(`     - User UID: ${item.user.uid || '(não definido)'}`);
          console.log(`     - User Role: ${item.user.role}`);
          console.log(`     - User Display Name: ${item.user.displayName || '(não definido)'}`);
          console.log(`     - Invite Status: ${item.user.inviteStatus || 'N/A'}`);
          console.log(`     - Invite Token: ${item.user.inviteToken ? '(existe)' : '(não existe)'}`);
          console.log('');
        });
      } else {
        console.log('\n❌ Não encontrado em nenhuma empresa');
      }

      // Buscar na coleção users
      console.log('📂 Buscando na coleção users...');
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);

      let foundUser = null;
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        if (userData.email === email) {
          foundUser = {
            uid: userDoc.id,
            ...userData
          };
          break;
        }
      }

      if (foundUser) {
        console.log('✅ Encontrado na coleção users:');
        console.log(`  - UID: ${foundUser.uid}`);
        console.log(`  - Email: ${foundUser.email}`);
        console.log(`  - Display Name: ${foundUser.displayName || '(não definido)'}`);
        console.log(`  - Company ID: ${foundUser.companyId || '(não definido)'}`);
        console.log(`  - Created At: ${foundUser.createdAt ? new Date(foundUser.createdAt.seconds * 1000).toLocaleString() : '(não definido)'}`);
        console.log(`  - Last Login: ${foundUser.lastLogin ? new Date(foundUser.lastLogin.seconds * 1000).toLocaleString() : '(não definido)'}`);
      } else {
        console.log('❌ Não encontrado na coleção users');
      }

    } catch (error) {
      console.log('\n❌ ERRO:', error.message);
      console.error(error);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Consulta concluída!');
  console.log('='.repeat(60) + '\n');
}

queryUsers()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
