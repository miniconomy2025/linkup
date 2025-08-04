import mongoose from 'mongoose';

let isConnected = false;

export const connectMongoDB = async (): Promise<typeof mongoose> => {
  if (isConnected) 
    return mongoose;

  const uri = process.env.MONGO_URI!;

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions);

  isConnected = true;

  return mongoose;
}; 