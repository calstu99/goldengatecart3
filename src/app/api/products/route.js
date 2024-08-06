import { NextResponse } from 'next/server';
import connect from '@/app/utils/db';
import Product from '@/app/models/Product';

export async function GET() {
  await connect();
  const products = await Product.find({});
  return NextResponse.json(products);
}

export async function POST(request) {
  await connect();
  const data = await request.json();
  const product = await Product.create(data);
  return NextResponse.json(product);
}

export async function PUT(request) {
  await connect();
  const data = await request.json();
  const { _id, ...updateData } = data;
  const product = await Product.findByIdAndUpdate(_id, updateData, { new: true });
  return NextResponse.json(product);
}

export async function DELETE(request) {
  await connect();
  const { id } = await request.json();
  await Product.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Product deleted' });
}