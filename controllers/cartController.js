const supabase = require('../config/supabaseClient');

exports.addToCart = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  const { error } = await supabase
    .from('cart_items')
    .insert([{ user_id, product_id, quantity }]);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Item added to cart' });
};