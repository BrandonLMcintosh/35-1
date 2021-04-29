const express = require("express");
const db = require("../db");
const router = new express.Router();

router.get("", async (req, res, next) => {
	try {
		const result = await db.query(`SELECT * FROM invoices`);
		return res.json({
			invoices: result,
		});
	} catch (err) {
		next(err);
	}
});

router.post("", async (req, res, next) => {
	try{
		const {id, comp_code, amt}
		const result = await db.query(
			`INSERT INTO invoices 
			(id, comp_code, amt, paid, add_date) 
			VALUES ($1, $2, $3, $4, $5)`, [])
	}catch(err){
		next(err);
	}
});

router.get("/:id", async (req, res, next) => {});

router.put("/:id", async (req, res, next) => {});

router.delete("/:id", async (req, res, next) => {});

module.exports = router;
