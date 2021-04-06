import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('db.currUser');

const createTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      'create table if not exists user('+
        'id integer primary key not null,'+
        'email text,'+
        'name text,'+
        'carPlateNumber text,'+
        'contactNumber text'+
      ')'
    )
  })
}

const insertData = (userObj) => {
  console.log("userobj: ", userObj);
  db.transaction(tx => {
    tx.executeSql(
      'insert into user(email, name, carPlateNumber, contactNumber) values (?, ?, ?, ?)',
      [userObj.email, userObj.name, userObj.carPlateNumber, userObj.contactNumber]
      ,(transact,resultset) => console.log('we made it',JSON.stringify(resultset))
      ,(transact,err) => console.log('We have encounter an Error', err)
    )
  })
}

const initializeData = () => {
  db.transaction(tx => {
    tx.executeSql(
      'insert into user(email, name, carPlateNumber, contactNumber) values (?, ?, ?, ?)',
      ["","","",""]
      ,(transact,resultset) => console.log('we madee it',JSON.stringify(resultset))
      ,(transact,err) => console.log('We have encounter an ewwor', err)
    )
  })
}

const getData = (setData) => {
  db.transaction(tx => {
    tx.executeSql(
      'select * from user WHERE id = 1',
      null,
      (_, {rows: {_array}}) => {setData(_array)},
      (_, error) => {
         console.log(error)
      }
    )
    
  })
  
}


const getData1 = (setData) => {
  db.transaction(tx => {
    tx.executeSql(
      'select * from user WHERE id = 1',
      [],
      (_, {rows: {_array}}) => {setData(_array), console.log("awway:", _array)},
      (_, error) => {
         console.log(error)
      }
    )
  })
}

const getAllData = () => {
  db.transaction(tx => {
    tx.executeSql(
      'select * from user WHERE id = 1',
      null,
      (_, {rows: {_array}}) => {},
      (_, error) => {
         console.log(error)
      }
    )
  })
}

const updateData = (userObj, setUser) => {
 db.transaction(tx => {
   tx.executeSql(
     'update user set email = ?, name = ?, carPlateNumber = ?, contactNumber = ? where id = 1',
     [userObj.email, userObj.name, userObj.carPlateNumber, userObj.contactNumber],
     (_,success) => {
       getData(setUser)
     }
   )
 }) 
}

const deleteData = (id, setItems) => {
 db.transaction(tx => {
   tx.executeSql(
     'delete from user where id = ?',
     [id],
     (_,success) => {
       getAllData()
     }
   )
 }) 
}

const deleteAll = () => {
 db.transaction(tx => {
   tx.executeSql(
     'delete from user',
     (_,success) => {

     }
   )
 }) 
}

export const Database = {
  db,
  createTable,
  insertData,
  initializeData,
  getData,
  getData1,
  getAllData,
  updateData,
  deleteData,
  deleteAll,
}