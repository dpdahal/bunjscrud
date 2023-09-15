import { Database } from 'bun:sqlite';

export interface Users {
    id?: number;
    name: string;
    email: string;
    address:string;
    phone:number;
}

class UsersDatabase {
    private db: Database;
    
    async createTable() {
        return this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            address TEXT,
            phone NUMBER
            )`);
    }

    constructor() {
        this.db = new Database('crud.sqlite3');
        this.createTable()
            .then(() => console.log('Database was successfully created'))
            .catch(console.error);
    }

    async index() {
        return this.db.query('SELECT * FROM users').all();
    }

    async show(id:number){
        return this.db.query(`SELECT * FROM users WHERE id = ${id}`).all();
    }

    async create(users: Users) {
        return this.db.query(`INSERT INTO users (name, email,address,phone) VALUES (?, ?,?,?) RETURNING id`).get(users.name, users.email,users.address,users.phone) as Users;
    }

    async update(id: number, users: Users) {
        return this.db.run(`UPDATE users SET name = '${users.name}', email = '${users.email}',address='${users.address}',phone='${users.phone}' WHERE id = ${id}`)
    }

    async delete(id: number) {
        return this.db.run(`DELETE FROM users WHERE id = ${id}`)
    }

}

export default UsersDatabase;