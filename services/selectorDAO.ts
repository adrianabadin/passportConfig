import { IDAO, IDAOSelector} from '../types';
const MongoDAO=require('./mongoDAO')
const SqlDAO = require('./sqlDAO')
console.log(SqlDAO)
class DAOSelector implements IDAOSelector {
   constructor(
   public MONGO:any =  MongoDAO,
   public SQL:any = SqlDAO
   ){}
    
}
const DAOSelectorObject =new DAOSelector()

export default DAOSelectorObject



