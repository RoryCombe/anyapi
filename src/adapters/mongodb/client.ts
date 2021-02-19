import { MongoClient, Db } from 'mongodb';

let db: Db;

export const connect = async () => {
  const client = await MongoClient.connect(process.env.DB_URL as any);
  db = client.db(process.env.DB_NAME as any);
};

// const truncate = async () => {
//   if (mongoose.connection.readyState !== 0) {
//     const { collections } = mongoose.connection;

//     const promises = Object.keys(collections).map((collection) =>
//       mongoose.connection.collection(collection).deleteMany({})
//     );

//     await Promise.all(promises);
//   }
// };

// const disconnect = async () => {
//   if (mongoose.connection.readyState !== 0) {
//     await mongoose.disconnect();
//   }
// };
