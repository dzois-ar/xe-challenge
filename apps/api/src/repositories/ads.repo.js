/**
 * Repository layer: ONLY SQL and mapping.
 * No Express/HTTP here.
 */
const { pool } = require("../db/pool");
const { translatePgError } = require("../libs/dbErrors");

async function create(payload) {
  const sql = `
    INSERT INTO ads (title, type, area_place_id, area_label, price, description)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, title, type, area_place_id, area_label, price, description, created_at
  `;

  const params = [
    payload.title,
    payload.type,
    payload.area.placeId,
    payload.area.label,
    payload.price,
    payload.description ?? null
  ];

  try {
    const { rows } = await pool.query(sql, params);
    const r = rows[0];
    return {
      id: r.id,
      title: r.title,
      type: r.type,
      area: { placeId: r.area_place_id, label: r.area_label },
      price: r.price,
      description: r.description,
      createdAt: r.created_at
    };
  } catch (err) {
    const translated = translatePgError(err);
    if (translated) throw translated; // becomes 400/409 etc with clean message
    throw err; // unknown -> will become 500 by global error handler
  }
}

async function getById(id) {
  
  const sql = `
    SELECT id, title, type, area_place_id, area_label, price, description, created_at
    FROM ads
    WHERE id = $1
  `;

  try {
    const { rows } = await pool.query(sql, [id]);
    if (rows.length === 0) return null;

    const r = rows[0];
    return {
      id: r.id,
      title: r.title,
      type: r.type,
      area: { placeId: r.area_place_id, label: r.area_label },
      price: r.price,
      description: r.description,
      createdAt: r.created_at
    };
  } catch (err) {
    const translated = translatePgError(err);
    if (translated) throw translated;
    throw err;
  }
}

module.exports = { create, getById };

