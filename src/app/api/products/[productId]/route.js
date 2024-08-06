import { NextResponse } from 'next/server';
import connect from '@/app/utils/db';
import Product from '@/app/models/Product';

export async function GET(request, { params }) {
  await connect();
  try {
    const product = await Product.findById(params.productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
    await connect();
    try {
      const body = await request.json();
      const updatedProduct = await Product.findByIdAndUpdate(params.productId, body, { new: true });
      if (!updatedProduct) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json(updatedProduct);
    } catch (error) {
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }