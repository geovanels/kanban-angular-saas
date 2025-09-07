const admin = require('firebase-admin');

// Inicializar Firebase Admin com as credenciais do projeto
admin.initializeApp({
  projectId: 'kanban-gobuyer'
});

const db = admin.firestore();

async function deleteCollection(collectionPath) {
  const collectionRef = db.collection(collectionPath);
  
  try {
    const snapshot = await collectionRef.get();
    if (snapshot.empty) {
      console.log(`✅ Coleção '${collectionPath}' já está vazia`);
      return;
    }

    console.log(`🗑️ Excluindo ${snapshot.docs.length} documentos da coleção '${collectionPath}'`);
    
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`✅ Coleção '${collectionPath}' limpa com sucesso!`);
    
    // Recursivamente limpar se ainda há documentos (limite do batch é 500)
    if (snapshot.docs.length === 500) {
      await deleteCollection(collectionPath);
    }
  } catch (error) {
    console.error(`❌ Erro ao limpar coleção '${collectionPath}':`, error);
  }
}

async function deleteSubcollections(basePath) {
  console.log(`🔍 Procurando subcoleções em '${basePath}'`);
  
  const subcollections = [
    `${basePath}/boards`,
    `${basePath}/columns`, 
    `${basePath}/leads`,
    `${basePath}/history`,
    `${basePath}/templates`,
    `${basePath}/automations`,
    `${basePath}/automation-history`,
    `${basePath}/email-queue`
  ];
  
  for (const subcollection of subcollections) {
    await deleteCollection(subcollection);
  }
}

async function cleanDatabase() {
  console.log('🚀 Iniciando limpeza completa do banco de dados...\n');
  
  try {
    // 1. Limpar coleções principais
    const mainCollections = [
      'companies',
      'users'
    ];
    
    for (const collection of mainCollections) {
      await deleteCollection(collection);
    }
    
    // 2. Limpar estrutura de usuários e suas subcoleções
    console.log('\n🔍 Procurando dados de usuários...');
    const usersSnapshot = await db.collection('users').get();
    
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      console.log(`🗑️ Limpando dados do usuário: ${userId}`);
      
      // Limpar subcoleções do usuário
      await deleteSubcollections(`users/${userId}`);
    }
    
    // 3. Limpar dados de empresas
    console.log('\n🔍 Procurando dados de empresas...');  
    const companiesSnapshot = await db.collection('companies').get();
    
    for (const companyDoc of companiesSnapshot.docs) {
      const companyId = companyDoc.id;
      console.log(`🗑️ Limpando dados da empresa: ${companyId}`);
      
      // Limpar subcoleções da empresa
      await deleteSubcollections(`companies/${companyId}`);
    }
    
    // 4. Limpar coleções principais novamente para garantir
    for (const collection of mainCollections) {
      await deleteCollection(collection);
    }
    
    console.log('\n✅ Limpeza completa do banco de dados finalizada!');
    console.log('🎉 Banco de dados está limpo para novos testes manuais');
    
  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error);
  }
  
  process.exit(0);
}

// Executar limpeza
cleanDatabase();