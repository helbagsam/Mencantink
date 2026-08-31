/**
 * Keranjang, pesanan, dan katalog.
 *
 * Sebelumnya semuanya hanya hidup di useState, sehingga muat ulang halaman
 * menghapus keranjang dan riwayat pesanan. Untuk peragaan di depan penilai itu
 * berbahaya: satu kali refresh tidak sengaja dan demo harus diulang dari nol.
 */

import { BatikMotif, CartItem, Order } from '../types';
import { INITIAL_CART_ITEMS, INITIAL_ORDER_SAMPLE } from '../data/cartMock';
import { INITIAL_MOTIFS } from '../data/mockData';
import { readCollection, writeCollection } from './storage';

const CART = 'cart_items';
const ORDERS = 'orders';
const MOTIFS = 'motifs';

export async function getCart(): Promise<CartItem[]> {
  return readCollection<CartItem>(CART, INITIAL_CART_ITEMS);
}

export async function saveCart(items: CartItem[]): Promise<void> {
  await writeCollection(CART, items);
}

export async function getOrders(): Promise<Order[]> {
  return readCollection<Order>(ORDERS, [INITIAL_ORDER_SAMPLE]);
}

export async function saveOrders(orders: Order[]): Promise<void> {
  await writeCollection(ORDERS, orders);
}

export async function getMotifs(): Promise<BatikMotif[]> {
  return readCollection<BatikMotif>(MOTIFS, INITIAL_MOTIFS);
}

export async function saveMotifs(motifs: BatikMotif[]): Promise<void> {
  await writeCollection(MOTIFS, motifs);
}
