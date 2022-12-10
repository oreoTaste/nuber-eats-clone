import "reflect-metadata"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5433,
    username: "oreoTaste",
    password: "1234",
    database: "nuber-eats",
    synchronize: true,
    logging: true,
    entities: ['dist/**/*.entity{.ts,.js}'],
    // subscribers: [],
    // migrations: [],
})