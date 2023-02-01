import { Client, QueryConfig, QueryResult } from 'pg';
import format from 'pg-format';

const client: Client = new Client({
  user: 'SEU_USUÁRIO',
  password: 'SUA_SENHA',
  host: 'localhost',
  database: 'SEU_BANCO_DE_DADOS',
  port: 5432,
});

const startDatabase = async (): Promise<void> => {
  await client.connect();
  console.log('Database connected.');
};

interface Product {
  id: number;
  name: string;
  price: number;
}

type ProductCreate = Omit<Product, 'id'>;
type ProductResult = QueryResult<Product>;

const insertQuery = async (payload: ProductCreate): Promise<Product> => {
  const queryString: string = `
    INSERT INTO "products" ("name", "price")
    VALUES ($1, $2)
    RETURNING *;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: Object.values(payload),
  };

  const queryResult: ProductResult = await client.query(queryConfig);
  const product: Product = queryResult.rows[0];

  return product;
};

const insertQueryFormat = async (payload: ProductCreate): Promise<Product> => {
  const queryString: string = format(
    `
    INSERT INTO "products" (%I)
    VALUES (%L)
    RETURNING *;
  `,
    Object.keys(payload),
    Object.values(payload)
  );

  const queryResult: ProductResult = await client.query(queryString);
  const product: Product = queryResult.rows[0];

  return product;
};

const main = async (): Promise<void> => {
  await startDatabase();

  const newProduct: ProductCreate = {
    name: 'Produto 1',
    price: 78,
  };

  const product: Product = await insertQuery(newProduct);
  console.log(product);

  await client.end();
};

main();
