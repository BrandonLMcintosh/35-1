const express = require("express");
const db = require("../db");
const ExpressError = require("../expressError");
const router = new express.Router();

router.get("", async (req, res, next) => {
	try {
		const result = await db.query(`SELECT * FROM invoices`);
		return res.json({
			invoices: result.rows,
		});
	} catch (err) {
		next(err);
	}
});

router.post("", async (req, res, next) => {
	try {
		const { id, comp_code, amt } = req.body;
		const result = await db.query(
			`INSERT INTO invoices 
			(id, comp_code, amt, paid, add_date) 
			VALUES ($1, $2, $3, $4, to_timestamp($5))
			RETURNING id, comp_code, amt, paid, add_date, paid_date`,
			[id, comp_code, amt, false, Date.now()]
		);
		res.json({
			added_invoice: result.rows,
		});
	} catch (err) {
		next(err);
	}
});

router.get("/:id", async (req, res, next) => {
	try {
		const id = req.params.id;
		const result = await db.query(
			`SELECT * FROM invoices
			WHERE id=$1`,
			[id]
		);
		if (result.rows === 0) {
			throw ExpressError("invoice not found", 404);
		}
		return res.json({
			invoice: result.rows,
		});
	} catch (err) {
		next(err);
	}
});

router.patch("/:id", async (req, res, next) => {
	try {
		const find = await db.query(
			`SELECT * FROM invoices
			WHERE id=$1`,
			[req.params.id]
		);
		if (find.rows === 0) {
			throw ExpressError("Item not found", 404);
		}
		const invoice = find.rows[0];
		const id = req.params.id;
		const { amt = invoice.amt, paying = null } = req.body;
		let values;
		if (paying === true) {
			values = [amt, true, Date.now(), id];
		} else if (paying === false) {
			values = [amt, false, null, id];
		} else {
			values = [amt, invoice.paid, invoice.paid_date, id];
		}
		const result = await db.query(
			`UPDATE invoices
			SET amt=$1, paid=$2, paid_date=to_timestamp($3)
			WHERE id=$4
			RETURNING id, comp_code, amt, add_date, paid, paid_date`,
			values
		);
		return res.json({
			updated_invoice: result.rows,
		});
	} catch (err) {
		next(err);
	}
});

router.delete("/:id", async (req, res, next) => {
	try {
		const id = req.params.id;
		const result = await db.query(
			`DELETE FROM invoices
			WHERE id=$1`,
			[id]
		);
		return res.json({
			deleted_invoice: id,
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
