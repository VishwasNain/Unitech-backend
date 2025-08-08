const supabase = require('../config/supabaseClient');

exports.placeOrder = async (req, res) => {
  const { user_id, items, total } = req.body;

  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([{ user_id, total, status: 'Placed', ordered_at: new Date().toISOString() }]);

  if (orderError) return res.status(400).json({ error: orderError.message });

  const order_id = orderData[0].id;

  const orderItems = items.map(item => ({
    order_id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price
  }));

  await supabase.from('order_items').insert(orderItems);
  await supabase.from('cart_items').delete().eq('user_id', user_id);

  res.status(201).json({ message: 'Order placed' });
};