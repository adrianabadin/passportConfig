var knex = require('knex')({
  client: 'sqlite3',
  connection: { filename: './mydb.sqlite' }
})
// async function createTable1(){
// return  await knex.schema.createTable('adrian',(table)=>{
//   table.increments("id")
//   table.string("username")
//   table.string("password")
// })
// }
const tabla1 =knex('adrian')
tabla1.columnInfo().then((cosa)=>console.log(cosa))