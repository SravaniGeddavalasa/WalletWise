const Sequelize = require('sequelize');
const { newDb } = require('pg-mem');

async function test() {
  const db = newDb();
  db.public.none(`create table users(id text);`); // Just a test
  
  const sequelize = await db.adapters.createSequelizeInstance(Sequelize);
  
  const User = sequelize.define('user', {
    name: Sequelize.STRING
  });

  await sequelize.sync();
  
  await User.create({ name: 'Test' });
  const users = await User.findAll();
  console.log('SUCCESS! Memory db worked. Users:', users.length);
}

test().catch(console.error);
