const express = require("express");
const db = require("../db");
const router = new express.Router();

router.get("", async (req, res, next) => {
	try {
		const result = await db.query("SELECT * FROM companies");
		return res.json({
			companies: result.rows,
		});
	} catch (err) {
		next(err);
	}
});

router.post("", async (req, res, next) => {
	try {
		const { code, name, description } = req.body;
		const result = await db.query(
			`INSERT INTO companies
            (code, name, description)
            VALUES
            ($1,$2,$3)
            RETURNING code, name, description`,
			[code, name, description]
		);
		res.json({
			added_company: result.rows,
		});
	} catch (err) {
		next(err);
	}
});

router.get("/:code", async (req, res, next) => {
	try {
		const code = req.params.code;
		const result = await db.query(
			`SELECT * FROM companies
            WHERE code=$1`,
			[code]
		);
		return res.json({
			company: result.rows,
		});
	} catch (err) {
		next(err);
	}
});

router.patch("/:code", async (req, res, next) => {
	try {
		const code = req.params.code;
		const { name, description } = req.body;
		const result = await db.query(
			`UPDATE companies SET name=$1, description=$2
            WHERE code=$3
            RETURNING code, name, description`,
			[name, description, code]
		);
		return res.json({
			updated_company: result.rows,
		});
	} catch (err) {
		next(err);
	}
});

router.delete("/:code", async (req, res, next) => {
	try {
		const code = req.params.code;
		await db.query(
			`DELETE FROM companies
            WHERE code=$1`,
			[code]
		);
		return res.json({
			deleted_company: code,
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
