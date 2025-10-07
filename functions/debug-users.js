const admin = require('firebase-admin');

// Inicializar Firebase Admin (sem service account - usa as credenciais padrão)
admin.initializeApp();

const auth = admin.auth();
const firestore = admin.firestore();

async function debugUsers() {
  const users = [
    'geovane.lopes@gobuyer.com.br',
    'rayane.crisostomo@gobuyer.com.br'
  ];

  console.log('🔍 Comparando usuários...\n');

  for (const email of users) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📧 EMAIL: ${email}`);
    console.log('='.repeat(60));

    try {
      // Buscar no Firebase Auth
      const userRecord = await auth.getUserByEmail(email);

      console.log('\n✅ Firebase Authentication:');
      console.log('  - UID:', userRecord.uid);
      console.log('  - Display Name:', userRecord.displayName || '(não definido)');
      console.log('  - Email Verified:', userRecord.emailVerified);
      console.log('  - Disabled:', userRecord.disabled);
      console.log('  - Provider Data:');

      userRecord.providerData.forEach((provider, index) => {
        console.log(`    ${index + 1}. Provider: ${provider.providerId}`);
        console.log(`       - Email: ${provider.email}`);
        console.log(`       - Display Name: ${provider.displayName || '(não definido)'}`);
      });

      // Verificar se tem senha
      const hasPassword = userRecord.providerData.some(p => p.providerId === 'password');
      const hasGoogle = userRecord.providerData.some(p => p.providerId === 'google.com');

      console.log('\n  🔐 Métodos de Login:');
      console.log('    - Email/Senha:', hasPassword ? '✅ SIM' : '❌ NÃO');
      console.log('    - Google:', hasGoogle ? '✅ SIM' : '❌ NÃO');

      // Buscar no Firestore - coleção users
      console.log('\n📂 Firestore (users):');
      const userDoc = await firestore.collection('users').doc(userRecord.uid).get();
      if (userDoc.exists) {
        console.log('  ✅ Documento existe');
        console.log('  - Dados:', JSON.stringify(userDoc.data(), null, 2).split('\n').map(l => '    ' + l).join('\n').trim());
      } else {
        console.log('  ❌ Documento não existe');
      }

      // Buscar empresas do usuário
      console.log('\n🏢 Empresas (companies):');
      const companiesSnapshot = await firestore.collection('companies')
        .where('users', 'array-contains', { email: email })
        .get();

      if (!companiesSnapshot.empty) {
        companiesSnapshot.forEach((doc, index) => {
          const data = doc.data();
          console.log(`  ${index + 1}. Empresa: ${data.name}`);
          console.log(`     - ID: ${doc.id}`);
          console.log(`     - Subdomain: ${data.subdomain}`);
          console.log(`     - Status: ${data.status || 'N/A'}`);

          // Buscar o usuário específico dentro da empresa
          const companyUser = data.users?.find(u => u.email === email);
          if (companyUser) {
            console.log(`     - Role: ${companyUser.role}`);
            console.log(`     - Invite Status: ${companyUser.inviteStatus || 'N/A'}`);
            console.log(`     - UID no company: ${companyUser.uid || '(não definido)'}`);
          }
        });
      } else {
        console.log('  ❌ Não encontrado em nenhuma empresa');
      }

    } catch (error) {
      console.log('\n❌ ERRO:', error.message);

      if (error.code === 'auth/user-not-found') {
        console.log('  ⚠️  Usuário não existe no Firebase Authentication');

        // Mesmo assim, verificar se existe alguma empresa com esse email
        console.log('\n🏢 Verificando empresas no Firestore...');
        const companiesSnapshot = await firestore.collection('companies').get();
        let found = false;

        companiesSnapshot.forEach(doc => {
          const data = doc.data();
          const hasUser = data.users?.some(u => u.email === email);
          if (hasUser) {
            found = true;
            console.log(`  ✅ Encontrado na empresa: ${data.name} (${doc.id})`);
            const user = data.users.find(u => u.email === email);
            console.log(`     - Role: ${user.role}`);
            console.log(`     - Invite Status: ${user.inviteStatus || 'N/A'}`);
          }
        });

        if (!found) {
          console.log('  ❌ Não encontrado em nenhuma empresa');
        }
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Análise concluída!');
  console.log('='.repeat(60) + '\n');
}

debugUsers()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
