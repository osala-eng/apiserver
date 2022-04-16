import md5 from 'md5'
import sqlite3 from 'sqlite3'

const DBSOURCE = "dtb.sqlite" 


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }
    else{
        console.log('Connected to database.')
        db.run(`CREATE TABLE usertbl (
                username VARCHAR PRIMARY KEY, password VARCHAR)`,(err)=>{
                if (err){
                    console.log("user table available")
                }
                else{
                    var insert = 'INSERT INTO usertbl VALUES (?,?)'
                    db.run(insert,["admin",md5("admin")])
                }
            })
    }
});


export default db