-- ============================================================
-- RestoBiz — seed data generated from src/data/mockData.ts
-- Run this AFTER supabase-schema.sql and supabase-rls.sql
-- ============================================================

-- Restaurants
insert into restaurants (id, slug, name, logo_url, cover_url, cuisines, gst_percent, service_charge_percent, currency)
values ('be4803f5-fbd1-5dd2-909b-c14ea68ead46', 'spice-route', 'Spice Route Kitchen', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop&auto=format', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop&auto=format', ARRAY['North Indian', 'Mughlai', 'Tandoor']::text[], 5, 5, 'INR');
insert into restaurants (id, slug, name, logo_url, cover_url, cuisines, gst_percent, service_charge_percent, currency)
values ('c2bac9cc-950b-5a11-b3bc-36bf47523f55', 'bombay-brew-cafe', 'Bombay Brew Café', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=200&h=200&fit=crop&auto=format', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&h=400&fit=crop&auto=format', ARRAY['Café', 'Continental', 'Beverages']::text[], 5, 0, 'INR');

-- Tables
insert into restaurant_tables (id, restaurant_id, number, label)
values ('e6f8d0da-436c-561e-9a23-19ea54d5ac24', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 1, 'Table 1');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('bbaecc06-2755-5217-91bd-a72af52fc31e', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 2, 'Table 2');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('0554c46a-521d-5f71-9432-b729b52b602a', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 3, 'Table 3');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('1f879d7f-66df-53e0-ba0c-d6c50384d8dd', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 4, 'Table 4');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('ecdd979b-ef22-508f-ad93-1da2e043bbd9', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 5, 'Table 5');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('660dbba0-3e61-5491-805c-ea64647dc091', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 6, 'Table 6');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('2c20259e-17f2-51e4-bef6-52896c82ae0b', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 7, 'Table 7');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('4f327661-d226-5a56-a873-97394681845b', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 8, 'Table 8');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('40fcb1f6-f79d-5b9b-ab6a-262af1b217d3', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 9, 'Table 9');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('d5dff3f5-ffd0-524b-8d0b-82b13c0591cd', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 10, 'Table 10');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('d3b8ba9e-83ff-5e2f-94bf-e7d5bbb967c8', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 11, 'Table 11');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('77e8a468-77e3-5e13-94e0-af9bb1a24f97', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 12, 'Table 12');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('88b56e65-4aac-55bf-90e0-2d931150249a', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 13, 'Table 13');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('6a20ba2b-f6cb-5217-bc33-178ccf56edf8', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 14, 'Table 14');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('1f9e040e-f5cc-525b-aff0-50bd0ae44e9c', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 15, 'Table 15');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('b6cc7d84-06e0-5b49-a87b-07ae753a8842', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 16, 'Table 16');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('40c53dae-46ec-5f04-9740-e7c5e1e0fa7a', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 17, 'Table 17');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('4e5b9d1f-d0a4-5460-8db7-275231684046', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 18, 'Table 18');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('0c6b0798-8b0c-50b2-b51e-b1d97bfda8a1', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 19, 'Table 19');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('021b259f-5a98-50cf-9272-f4e81d528142', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 20, 'Table 20');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('79615a66-5812-5430-ba9a-faa142322364', 'c2bac9cc-950b-5a11-b3bc-36bf47523f55', 1, 'Table 1');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('9fdd9ac0-6ad0-5aed-83f3-a4440dce7cc1', 'c2bac9cc-950b-5a11-b3bc-36bf47523f55', 2, 'Table 2');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('8b2f9e9e-713c-5723-9426-b15e9019f16a', 'c2bac9cc-950b-5a11-b3bc-36bf47523f55', 3, 'Table 3');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('49097f5c-075e-57f4-8317-83e94579a8be', 'c2bac9cc-950b-5a11-b3bc-36bf47523f55', 4, 'Table 4');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('70d4365b-c5f2-5887-bb36-f176d47bb1f1', 'c2bac9cc-950b-5a11-b3bc-36bf47523f55', 5, 'Table 5');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('163ae97e-86ac-5212-bf2d-94c9a8c2412c', 'c2bac9cc-950b-5a11-b3bc-36bf47523f55', 6, 'Table 6');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('64ab44da-514f-57cd-8cb4-5076527b2b1d', 'c2bac9cc-950b-5a11-b3bc-36bf47523f55', 7, 'Table 7');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('fb2c1851-c442-5ed9-b949-e5a6a530f359', 'c2bac9cc-950b-5a11-b3bc-36bf47523f55', 8, 'Table 8');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('422a7360-9d57-5a77-81d7-428360aa3a0a', 'c2bac9cc-950b-5a11-b3bc-36bf47523f55', 9, 'Table 9');
insert into restaurant_tables (id, restaurant_id, number, label)
values ('a66251a5-47f3-5c33-aa8c-cf08f2237967', 'c2bac9cc-950b-5a11-b3bc-36bf47523f55', 10, 'Table 10');

-- Categories
insert into categories (id, restaurant_id, name, sort_order)
values ('da0415d8-fafb-584b-bf62-589b0f78aaf4', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 'Starters', 1);
insert into categories (id, restaurant_id, name, sort_order)
values ('41150a45-a8b0-5803-8438-d4ca3714329d', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 'Mains', 2);
insert into categories (id, restaurant_id, name, sort_order)
values ('8416b1fb-4333-56b3-b8ea-5954e3b1e191', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 'Breads', 3);
insert into categories (id, restaurant_id, name, sort_order)
values ('c46f3b07-f0f7-50a1-818f-b9d5dcaa261a', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 'Rice & Biryani', 4);
insert into categories (id, restaurant_id, name, sort_order)
values ('de1606de-dc04-5bcd-84fa-5e42ea94796c', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 'Desserts', 5);
insert into categories (id, restaurant_id, name, sort_order)
values ('a5154794-a610-5136-83ac-d836a504ed77', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 'Beverages', 6);
insert into categories (id, restaurant_id, name, sort_order)
values ('a7ce192b-ba0a-53df-a4c7-0e68f1edf07d', 'c2bac9cc-950b-5a11-b3bc-36bf47523f55', 'Coffee', 1);
insert into categories (id, restaurant_id, name, sort_order)
values ('6353f613-039e-5fca-98c8-c37a03ce9ccd', 'c2bac9cc-950b-5a11-b3bc-36bf47523f55', 'Bakes', 2);
insert into categories (id, restaurant_id, name, sort_order)
values ('9de63f42-f544-5e0d-87ae-92961ae726fe', 'c2bac9cc-950b-5a11-b3bc-36bf47523f55', 'All-Day Breakfast', 3);

-- Menu items
insert into menu_items (id, restaurant_id, category_id, name, description, price, image_url, is_veg, is_best_seller, spice_level, rating, rating_count, prep_time_minutes, ingredients, is_available)
values ('4b115e94-c108-5dc5-978f-fcf74341cafe', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 'da0415d8-fafb-584b-bf62-589b0f78aaf4', 'Paneer Tikka', 'Char-grilled cottage cheese marinated in hung curd, ginger-garlic and smoked spices, served with mint chutney.', 289, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=450&fit=crop&auto=format', true, true, 2, 4.6, 214, 18, ARRAY['Paneer', 'Hung curd', 'Bell pepper', 'Onion', 'Kashmiri chilli', 'Mustard oil']::text[], true);
insert into menu_items (id, restaurant_id, category_id, name, description, price, image_url, is_veg, is_best_seller, spice_level, rating, rating_count, prep_time_minutes, ingredients, is_available)
values ('55bcac13-4beb-58d7-868d-165e28f8a845', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 'da0415d8-fafb-584b-bf62-589b0f78aaf4', 'Chicken 65', 'Deep-fried curry leaf and byadgi chilli chicken, tossed in a tangy South Indian glaze.', 319, 'https://images.unsplash.com/photo-1626082927389-6cd097cee6a6?w=600&h=450&fit=crop&auto=format', false, true, 3, 4.7, 341, 20, ARRAY['Chicken', 'Curry leaves', 'Byadgi chilli', 'Curd', 'Rice flour']::text[], true);
insert into menu_items (id, restaurant_id, category_id, name, description, price, image_url, is_veg, is_best_seller, spice_level, rating, rating_count, prep_time_minutes, ingredients, is_available)
values ('bed070c1-5a63-51fa-b121-a1e4a020a8ac', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 'da0415d8-fafb-584b-bf62-589b0f78aaf4', 'Hara Bhara Kebab', 'Spinach and green pea patties studded with cashew, pan-seared to a crisp crust.', 249, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=450&fit=crop&auto=format', true, false, 1, 4.3, 98, 15, ARRAY['Spinach', 'Green peas', 'Potato', 'Cashew', 'Chaat masala']::text[], true);
insert into menu_items (id, restaurant_id, category_id, name, description, price, image_url, is_veg, is_best_seller, spice_level, rating, rating_count, prep_time_minutes, ingredients, is_available)
values ('18cc3daa-23f3-50a4-8781-c08841dd8cc0', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', '41150a45-a8b0-5803-8438-d4ca3714329d', 'Butter Chicken', 'Tandoor-roasted chicken simmered in a velvety tomato-butter gravy, finished with cream.', 389, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=450&fit=crop&auto=format', false, true, 1, 4.8, 512, 22, ARRAY['Chicken', 'Tomato', 'Butter', 'Cream', 'Fenugreek', 'Garam masala']::text[], true);
insert into menu_items (id, restaurant_id, category_id, name, description, price, image_url, is_veg, is_best_seller, spice_level, rating, rating_count, prep_time_minutes, ingredients, is_available)
values ('846ebd2b-9d3b-5e80-ada1-aba905d971a8', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', '41150a45-a8b0-5803-8438-d4ca3714329d', 'Paneer Lababdar', 'Soft paneer cubes in a rich cashew-tomato gravy with a hint of saffron.', 329, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=450&fit=crop&auto=format', true, false, 1, 4.5, 176, 20, ARRAY['Paneer', 'Cashew', 'Tomato', 'Cream', 'Saffron']::text[], true);
insert into menu_items (id, restaurant_id, category_id, name, description, price, image_url, is_veg, is_best_seller, spice_level, rating, rating_count, prep_time_minutes, ingredients, is_available)
values ('a56f4f83-9055-584c-93f0-63d44056741a', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', '41150a45-a8b0-5803-8438-d4ca3714329d', 'Dal Makhani', 'Black lentils and kidney beans, slow-simmered overnight with butter and cream.', 259, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=450&fit=crop&auto=format', true, true, 0, 4.7, 289, 25, ARRAY['Black urad dal', 'Rajma', 'Butter', 'Cream', 'Tomato']::text[], true);
insert into menu_items (id, restaurant_id, category_id, name, description, price, image_url, is_veg, is_best_seller, spice_level, rating, rating_count, prep_time_minutes, ingredients, is_available)
values ('f3377ed5-2fd4-5fff-9682-aee9f6a4f207', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', '41150a45-a8b0-5803-8438-d4ca3714329d', 'Mutton Rogan Josh', 'Slow-braised mutton in a Kashmiri red chilli and yoghurt gravy, deeply aromatic.', 449, 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&h=450&fit=crop&auto=format', false, false, 3, 4.6, 143, 35, ARRAY['Mutton', 'Curd', 'Kashmiri chilli', 'Fennel', 'Ginger']::text[], true);
insert into menu_items (id, restaurant_id, category_id, name, description, price, image_url, is_veg, is_best_seller, spice_level, rating, rating_count, prep_time_minutes, ingredients, is_available)
values ('f8ee6338-daf9-52f9-a1b2-39d48b81aa39', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', '8416b1fb-4333-56b3-b8ea-5954e3b1e191', 'Butter Naan', 'Leavened tandoor bread brushed with butter, baked to order.', 69, 'https://images.unsplash.com/photo-1601050690597-9d7bd7fbf3f0?w=600&h=450&fit=crop&auto=format', true, true, 0, 4.5, 402, 10, ARRAY['Refined flour', 'Yeast', 'Curd', 'Butter']::text[], true);
insert into menu_items (id, restaurant_id, category_id, name, description, price, image_url, is_veg, is_best_seller, spice_level, rating, rating_count, prep_time_minutes, ingredients, is_available)
values ('35210b3a-a17f-5c06-88ba-743f1388ff0c', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', '8416b1fb-4333-56b3-b8ea-5954e3b1e191', 'Garlic Naan', 'Tandoor bread topped with roasted garlic and coriander.', 79, 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=600&h=450&fit=crop&auto=format', true, false, 0, 4.4, 187, 10, ARRAY['Refined flour', 'Garlic', 'Coriander', 'Butter']::text[], true);
insert into menu_items (id, restaurant_id, category_id, name, description, price, image_url, is_veg, is_best_seller, spice_level, rating, rating_count, prep_time_minutes, ingredients, is_available)
values ('7091d909-85e4-508e-922e-27fbe0714207', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 'c46f3b07-f0f7-50a1-818f-b9d5dcaa261a', 'Hyderabadi Chicken Biryani', 'Long-grain basmati layered with marinated chicken, saffron and fried onions, dum-cooked.', 359, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=450&fit=crop&auto=format', false, true, 2, 4.9, 618, 30, ARRAY['Basmati rice', 'Chicken', 'Saffron', 'Fried onion', 'Mint']::text[], true);
insert into menu_items (id, restaurant_id, category_id, name, description, price, image_url, is_veg, is_best_seller, spice_level, rating, rating_count, prep_time_minutes, ingredients, is_available)
values ('afea37d1-2eef-57c2-92e8-ce554c5570ed', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 'c46f3b07-f0f7-50a1-818f-b9d5dcaa261a', 'Veg Dum Biryani', 'Basmati rice dum-cooked with mixed vegetables, whole spices and saffron.', 279, 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&h=450&fit=crop&auto=format', true, false, 2, 4.4, 156, 28, ARRAY['Basmati rice', 'Mixed vegetables', 'Saffron', 'Whole spices']::text[], true);
insert into menu_items (id, restaurant_id, category_id, name, description, price, image_url, is_veg, is_best_seller, spice_level, rating, rating_count, prep_time_minutes, ingredients, is_available)
values ('374eeb92-7be1-56ae-b67e-7c33b7dda9d6', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 'de1606de-dc04-5bcd-84fa-5e42ea94796c', 'Gulab Jamun', 'Warm milk-solid dumplings soaked in cardamom-rose syrup.', 129, 'https://images.unsplash.com/photo-1666190092210-9c9ee5b8f5a1?w=600&h=450&fit=crop&auto=format', true, true, 0, 4.7, 233, 8, ARRAY['Khoya', 'Sugar syrup', 'Cardamom', 'Rose water']::text[], true);
insert into menu_items (id, restaurant_id, category_id, name, description, price, image_url, is_veg, is_best_seller, spice_level, rating, rating_count, prep_time_minutes, ingredients, is_available)
values ('ca24657f-1e13-50fa-905f-b8e3cf7c19c2', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 'de1606de-dc04-5bcd-84fa-5e42ea94796c', 'Gajar Ka Halwa', 'Slow-cooked grated carrot with milk, ghee and nuts. Seasonal favourite.', 159, 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=600&h=450&fit=crop&auto=format', true, false, 0, 4.5, 87, 10, ARRAY['Carrot', 'Milk', 'Ghee', 'Almonds', 'Cardamom']::text[], true);
insert into menu_items (id, restaurant_id, category_id, name, description, price, image_url, is_veg, is_best_seller, spice_level, rating, rating_count, prep_time_minutes, ingredients, is_available)
values ('2b1da40a-dbbd-5b62-bfc2-8134045d6c87', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 'a5154794-a610-5136-83ac-d836a504ed77', 'Masala Chaas', 'Chilled spiced buttermilk with roasted cumin and curry leaf.', 79, 'https://images.unsplash.com/photo-1571212515416-fca325e2c923?w=600&h=450&fit=crop&auto=format', true, false, 1, 4.3, 64, 5, ARRAY['Yoghurt', 'Cumin', 'Curry leaf', 'Ginger']::text[], true);
insert into menu_items (id, restaurant_id, category_id, name, description, price, image_url, is_veg, is_best_seller, spice_level, rating, rating_count, prep_time_minutes, ingredients, is_available)
values ('95aa5133-84c6-5b08-8f09-00babe9abc9b', 'be4803f5-fbd1-5dd2-909b-c14ea68ead46', 'a5154794-a610-5136-83ac-d836a504ed77', 'Virgin Mojito', 'Fresh mint and lime muddled with soda over crushed ice.', 149, 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&h=450&fit=crop&auto=format', true, true, 0, 4.6, 121, 6, ARRAY['Mint', 'Lime', 'Soda', 'Sugar syrup']::text[], true);
insert into menu_items (id, restaurant_id, category_id, name, description, price, image_url, is_veg, is_best_seller, spice_level, rating, rating_count, prep_time_minutes, ingredients, is_available)
values ('b8b929ee-79de-5d04-b848-b253651cfbe2', 'c2bac9cc-950b-5a11-b3bc-36bf47523f55', 'a7ce192b-ba0a-53df-a4c7-0e68f1edf07d', 'Flat White', 'Double ristretto shots with silky micro-foamed milk.', 189, 'https://images.unsplash.com/photo-1560717845-968823efbee1?w=600&h=450&fit=crop&auto=format', true, true, 0, 4.7, 156, 6, ARRAY['Espresso', 'Milk']::text[], true);
insert into menu_items (id, restaurant_id, category_id, name, description, price, image_url, is_veg, is_best_seller, spice_level, rating, rating_count, prep_time_minutes, ingredients, is_available)
values ('fc3f3474-1bf7-5abc-8e40-49c147b15af7', 'c2bac9cc-950b-5a11-b3bc-36bf47523f55', 'a7ce192b-ba0a-53df-a4c7-0e68f1edf07d', 'Cold Brew', 'Slow-steeped 18 hours, served over ice.', 179, 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&h=450&fit=crop&auto=format', true, false, 0, 4.5, 88, 4, ARRAY['Coffee concentrate', 'Ice', 'Water']::text[], true);
insert into menu_items (id, restaurant_id, category_id, name, description, price, image_url, is_veg, is_best_seller, spice_level, rating, rating_count, prep_time_minutes, ingredients, is_available)
values ('566cbc8d-f6b7-5902-8155-cfdb22af1569', 'c2bac9cc-950b-5a11-b3bc-36bf47523f55', '6353f613-039e-5fca-98c8-c37a03ce9ccd', 'Almond Croissant', 'Twice-baked, filled with almond cream, dusted with icing sugar.', 159, 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600&h=450&fit=crop&auto=format', true, true, 0, 4.8, 203, 5, ARRAY['Butter', 'Almond cream', 'Flour', 'Icing sugar']::text[], true);
insert into menu_items (id, restaurant_id, category_id, name, description, price, image_url, is_veg, is_best_seller, spice_level, rating, rating_count, prep_time_minutes, ingredients, is_available)
values ('d6639efe-dbcb-5618-80b9-183243835c64', 'c2bac9cc-950b-5a11-b3bc-36bf47523f55', '9de63f42-f544-5e0d-87ae-92961ae726fe', 'Avocado Toast', 'Sourdough, smashed avocado, chilli flakes, poached egg.', 299, 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=600&h=450&fit=crop&auto=format', false, true, 1, 4.6, 134, 12, ARRAY['Sourdough', 'Avocado', 'Egg', 'Chilli flakes', 'Lemon']::text[], true);
insert into menu_items (id, restaurant_id, category_id, name, description, price, image_url, is_veg, is_best_seller, spice_level, rating, rating_count, prep_time_minutes, ingredients, is_available)
values ('5ccd0c7d-708a-51b7-9ed8-c99a52955b8d', 'c2bac9cc-950b-5a11-b3bc-36bf47523f55', '9de63f42-f544-5e0d-87ae-92961ae726fe', 'Shakshuka', 'Eggs poached in a smoky tomato-pepper sauce, served with toast.', 279, 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=600&h=450&fit=crop&auto=format', false, false, 2, 4.4, 71, 15, ARRAY['Eggs', 'Tomato', 'Bell pepper', 'Cumin', 'Toast']::text[], true);

-- Staff reference (email/role/restaurant only — actual login accounts
-- get created separately via Supabase Auth in the next step; this table
-- just documents which staff belong to which restaurant for now).
-- Ramesh Kumar <ramesh@spiceroute.test> — role: waiter — restaurant: be4803f5-fbd1-5dd2-909b-c14ea68ead46
-- Anita Rao <anita@spiceroute.test> — role: chef — restaurant: be4803f5-fbd1-5dd2-909b-c14ea68ead46
-- Vikram Singh <vikram@spiceroute.test> — role: owner — restaurant: be4803f5-fbd1-5dd2-909b-c14ea68ead46
-- Priya Nair <priya@bombaybrew.test> — role: waiter — restaurant: c2bac9cc-950b-5a11-b3bc-36bf47523f55
-- Rohan Mehta <rohan@bombaybrew.test> — role: owner — restaurant: c2bac9cc-950b-5a11-b3bc-36bf47523f55
